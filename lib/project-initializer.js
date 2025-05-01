const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const execa = require('execa');

const logger = require('./logger');
const errorHandler = require('./error-handler');

/**
 * Execute a command with retry logic and proper error handling
 * @param {string} command - Command to execute
 * @param {string[]} args - Command arguments
 * @param {Object} options - Execution options
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
async function executeWithRetry(command, args, options, maxRetries = 3, timeout = 60000) {
  let lastError = null;
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      // Create a promise that will reject after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Command timed out after ${timeout}ms`)), timeout);
      });
      
      // Create the command execution promise with pipe instead of inherit
      // This gives us more control over the process
      const execaOptions = {
        ...options,
        stdio: ['pipe', 'pipe', 'pipe'],
        buffer: false
      };
      
      const execPromise = execa(command, args, execaOptions);
      
      // Set up output handling
      if (execPromise.stdout) {
        execPromise.stdout.on('data', (data) => {
          process.stdout.write(data);
        });
      }
      
      if (execPromise.stderr) {
        execPromise.stderr.on('data', (data) => {
          process.stderr.write(data);
        });
      }
      
      // Race between the command execution and the timeout
      await Promise.race([execPromise, timeoutPromise]);
      
      // If we get here, the command completed successfully
      return;
    } catch (error) {
      lastError = error;
      
      // Check if this is a "context canceled" error or other transient error
      const isTransientError =
        error.message.includes('context canceled') ||
        error.message.includes('timed out') ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ECONNREFUSED';
      
      if (isTransientError && retryCount < maxRetries) {
        // Log retry attempt
        logger.warn(`Command failed with error: ${error.message}. Retrying (${retryCount + 1}/${maxRetries})...`);
        
        // Exponential backoff: wait longer between each retry
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        retryCount++;
      } else {
        // Either not a transient error or we've exhausted retries
        throw error;
      }
    }
  }
}

/**
 * Initialize project by cloning the template repository using create-next-app
 * @param {Object} options - Initialization options
 * @param {string} options.projectName - Name of the project
 * @param {string} options.projectPath - Path to the project
 * @param {string} options.templateRepo - GitHub repository URL for the template
 * @returns {Promise<void>}
 */
async function initialize(options) {
  const { projectName, projectPath, templateRepo } = options;
  
  try {
    logger.startSpinner(`Creating project by cloning ${templateRepo}...`);
    
    // Use create-next-app to clone the repository directly
    await executeWithRetry('npx', [
      'create-next-app',
      projectName,
      '--use-npm',
      '--example',
      templateRepo
    ], {}, 2, 180000); // Longer timeout for create-next-app as it can take time
    
    logger.succeedSpinner('Project created successfully');
    
    // Additional initialization steps can be handled by the setup script
    logger.info('The project was created successfully. The setup script will handle the remaining initialization.');
    
  } catch (error) {
    logger.failSpinner('Failed to create project');
    
    // Use the appropriate error handler based on the error type
    if (error.message.includes('context canceled') ||
        error.message.includes('timed out') ||
        error.code === 'ETIMEDOUT' ||
        error.signal) {
      errorHandler.handleProcessError(error);
    } else if (error.code === 'ENOTFOUND' ||
               error.code === 'ECONNREFUSED' ||
               error.code === 'ECONNRESET') {
      errorHandler.handleNetworkError(error);
    } else {
      errorHandler.handleError(error);
    }
    
    throw error;
  }
}

module.exports = {
  initialize
};