const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const tar = require('tar');
const tmp = require('tmp-promise');
const { Readable } = require('stream');
const { promisify } = require('util');
const { pipeline } = require('stream');

const logger = require('./logger');
const errorHandler = require('./error-handler');

const pipelineAsync = promisify(pipeline);

// GitHub API request options with User-Agent to avoid 403 errors
const GITHUB_API_OPTIONS = {
  headers: {
    'User-Agent': 'create-supabase-next',
    'Accept': 'application/vnd.github.v3+json'
  }
};

// Optional GitHub token for authentication (increases rate limits)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (GITHUB_TOKEN) {
  GITHUB_API_OPTIONS.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
}

/**
 * Download a file from a URL
 * @param {string} url - URL to download from
 * @returns {Promise<Buffer>} - Downloaded data
 */
async function downloadFile(url) {
  return new Promise((resolve, reject) => {
    // Use the GitHub API options for the request
    const options = { ...GITHUB_API_OPTIONS };
    
    // Parse the URL to determine if it's a GitHub API URL
    const isGitHubApi = url.includes('api.github.com');
    
    https.get(url, isGitHubApi ? options : {}, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        downloadFile(response.headers.location)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Handle specific error codes with more detailed messages
      if (response.statusCode !== 200) {
        let errorMessage = `Failed to download file: ${response.statusCode} ${response.statusMessage}`;
        
        if (response.statusCode === 403) {
          if (response.headers['x-ratelimit-remaining'] === '0') {
            errorMessage = 'GitHub API rate limit exceeded. ';
            
            if (!GITHUB_TOKEN) {
              errorMessage += 'Consider setting a GITHUB_TOKEN environment variable to increase rate limits.';
            } else {
              const resetTime = new Date(parseInt(response.headers['x-ratelimit-reset']) * 1000);
              errorMessage += `Rate limit will reset at ${resetTime.toLocaleString()}.`;
            }
          } else {
            errorMessage = 'Access forbidden. The repository may be private or not exist.';
          }
        } else if (response.statusCode === 404) {
          errorMessage = 'Repository or branch not found. Please check the URL and branch name.';
        } else if (response.statusCode >= 500) {
          errorMessage = 'GitHub server error. Please try again later.';
        }
        
        reject(new Error(errorMessage));
        return;
      }
      
      const chunks = [];
      
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      
      response.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Download template from GitHub repository
 * @param {string} repoUrl - GitHub repository URL
 * @param {string} branch - Branch to download
 * @returns {Promise<string>} - Path to downloaded template
 */
async function downloadTemplate(repoUrl, branch = 'main') {
  try {
    // Parse GitHub repository URL
    const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    
    if (!repoMatch) {
      throw new Error(`Invalid GitHub repository URL: ${repoUrl}`);
    }
    
    const [, owner, repo] = repoMatch;
    const cleanRepo = repo.replace(/\.git$/, '');
    
    // Create temporary directory
    const tempDir = await tmp.dir({ unsafeCleanup: true });
    
    // Download tarball from GitHub
    const tarballUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/tarball/${branch}`;
    
    logger.startSpinner(`Downloading template from ${owner}/${cleanRepo} (branch: ${branch})...`);
    
    try {
      const tarballData = await downloadFile(tarballUrl);
      
      logger.updateSpinner('Extracting template files...');
      
      // Extract tarball
      const tarballStream = new Readable();
      tarballStream.push(tarballData);
      tarballStream.push(null);
      
      await pipelineAsync(
        tarballStream,
        tar.extract({ cwd: tempDir.path, strip: 1 })
      );
      
      logger.succeedSpinner('Template downloaded successfully');
      
      return tempDir.path;
    } catch (downloadError) {
      // If the main branch fails, try 'master' as a fallback if the branch is 'main'
      if (branch === 'main') {
        logger.updateSpinner('Main branch not found, trying master branch...');
        try {
          const masterTarballUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/tarball/master`;
          const tarballData = await downloadFile(masterTarballUrl);
          
          logger.updateSpinner('Extracting template files...');
          
          // Extract tarball
          const tarballStream = new Readable();
          tarballStream.push(tarballData);
          tarballStream.push(null);
          
          await pipelineAsync(
            tarballStream,
            tar.extract({ cwd: tempDir.path, strip: 1 })
          );
          
          logger.succeedSpinner('Template downloaded successfully from master branch');
          
          return tempDir.path;
        } catch (masterError) {
          // Both main and master failed, throw the original error
          throw downloadError;
        }
      } else {
        // Not trying to use 'main', so just throw the original error
        throw downloadError;
      }
    }
  } catch (error) {
    logger.failSpinner('Failed to download template');
    
    if (error.code === 'ENOTFOUND') {
      errorHandler.handleNetworkError(new Error(
        `Could not resolve hostname. Please check your internet connection and DNS settings.\n` +
        `Repository URL: ${repoUrl}`
      ));
    } else if (error.code === 'ETIMEDOUT') {
      errorHandler.handleNetworkError(new Error(
        `Connection timed out. The server might be down or your internet connection is slow.\n` +
        `Repository URL: ${repoUrl}`
      ));
    } else if (error.message.includes('rate limit exceeded')) {
      errorHandler.handleError(new Error(
        `GitHub API rate limit exceeded. Please try again later or set a GITHUB_TOKEN environment variable.\n` +
        `You can create a token at: https://github.com/settings/tokens`
      ));
    } else if (error.message.includes('Access forbidden') || error.message.includes('not found')) {
      errorHandler.handleError(new Error(
        `Repository not accessible: ${repoUrl}\n` +
        `Please check that the repository exists and is public.`
      ));
    } else {
      errorHandler.handleError(error);
    }
    
    throw error;
  }
}

/**
 * Copy template files to destination
 * @param {string} templatePath - Path to template files
 * @param {string} destPath - Destination path
 * @returns {Promise<void>}
 */
async function copyTemplateFiles(templatePath, destPath) {
  try {
    logger.startSpinner('Copying template files...');
    
    await fs.copy(templatePath, destPath, {
      filter: (src) => {
        // Skip node_modules and .git directories
        return !src.includes('node_modules') && !src.includes('.git');
      }
    });
    
    logger.succeedSpinner('Template files copied successfully');
  } catch (error) {
    logger.failSpinner('Failed to copy template files');
    errorHandler.handleFileSystemError(error);
    throw error;
  }
}

/**
 * Validate GitHub repository URL
 * @param {string} repoUrl - GitHub repository URL
 * @returns {Promise<boolean>} - Whether the repository is valid and accessible
 */
async function validateRepositoryUrl(repoUrl) {
  try {
    // Parse GitHub repository URL
    const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    
    if (!repoMatch) {
      logger.warn(`Invalid GitHub repository URL format: ${repoUrl}`);
      return false;
    }
    
    const [, owner, repo] = repoMatch;
    const cleanRepo = repo.replace(/\.git$/, '');
    
    // Check if repository exists and is accessible
    const repoApiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}`;
    
    try {
      await downloadFile(repoApiUrl);
      return true;
    } catch (error) {
      logger.warn(`Repository not accessible: ${repoUrl}`);
      return false;
    }
  } catch (error) {
    logger.warn(`Error validating repository URL: ${error.message}`);
    return false;
  }
}

module.exports = {
  downloadTemplate,
  copyTemplateFiles,
  validateRepositoryUrl
};