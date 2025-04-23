const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const execa = require('execa');

const logger = require('./logger');
const templateDownloader = require('./template-downloader');
const errorHandler = require('./error-handler');

/**
 * Run create-next-app
 * @param {string} projectName - Name of the project
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function runCreateNextApp(projectName, projectPath) {
  try {
    logger.startSpinner(`Creating Next.js app with create-next-app...`);
    
    await execa('npx', [
      'create-next-app',
      projectName,
      '--typescript',
      '--eslint',
      '--use-npm',
      '--yes'
    ], {
      stdio: 'inherit'
    });
    
    logger.succeedSpinner('Next.js app created successfully');
  } catch (error) {
    logger.failSpinner('Failed to create Next.js app');
    errorHandler.handleError(error);
    throw error;
  }
}

/**
 * Initialize Supabase
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function initializeSupabase(projectPath) {
  try {
    logger.startSpinner('Initializing Supabase...');
    
    try {
      // Try to initialize Supabase using npx
      await execa('npx', ['supabase', 'init'], {
        cwd: projectPath,
        stdio: 'inherit'
      });
      
      logger.succeedSpinner('Supabase initialized successfully');
    } catch (npxError) {
      // If npx fails, try direct command if available
      try {
        await execa('supabase', ['init'], {
          cwd: projectPath,
          stdio: 'inherit'
        });
        
        logger.succeedSpinner('Supabase initialized successfully');
      } catch (directError) {
        // Both methods failed
        throw new Error(
          'Failed to initialize Supabase. Please ensure Supabase CLI is installed correctly.\n' +
          'See installation instructions at: https://github.com/supabase/cli#install-the-cli'
        );
      }
    }
  } catch (error) {
    logger.failSpinner('Failed to initialize Supabase');
    errorHandler.handleError(error);
    throw error;
  }
}

/**
 * Install additional dependencies
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function installDependencies(projectPath) {
  try {
    logger.startSpinner('Installing additional dependencies...');
    
    // Install Tailwind CSS and related packages
    await execa('npm', [
      'install',
      '--save-dev',
      'tailwindcss',
      'postcss',
      'autoprefixer'
    ], {
      cwd: projectPath,
      stdio: 'inherit'
    });
    
    // Install Supabase client
    await execa('npm', [
      'install',
      '@supabase/supabase-js'
    ], {
      cwd: projectPath,
      stdio: 'inherit'
    });
    
    logger.succeedSpinner('Dependencies installed successfully');
  } catch (error) {
    logger.failSpinner('Failed to install dependencies');
    errorHandler.handleError(error);
    throw error;
  }
}

/**
 * Initialize Tailwind CSS
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function initializeTailwind(projectPath) {
  try {
    logger.startSpinner('Initializing Tailwind CSS...');
    
    await execa('npx', ['tailwindcss', 'init', '-p'], {
      cwd: projectPath,
      stdio: 'inherit'
    });
    
    logger.succeedSpinner('Tailwind CSS initialized successfully');
  } catch (error) {
    logger.failSpinner('Failed to initialize Tailwind CSS');
    errorHandler.handleError(error);
    throw error;
  }
}

/**
 * Configure environment variables
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function configureEnvironment(projectPath) {
  try {
    logger.startSpinner('Configuring environment variables...');
    
    // Copy .env.local.example to .env.local
    const envExamplePath = path.join(projectPath, '.env.local.example');
    const envPath = path.join(projectPath, '.env.local');
    
    if (await fs.pathExists(envExamplePath)) {
      await fs.copy(envExamplePath, envPath);
    }
    
    logger.succeedSpinner('Environment variables configured successfully');
  } catch (error) {
    logger.failSpinner('Failed to configure environment variables');
    errorHandler.handleFileSystemError(error);
    throw error;
  }
}

/**
 * Run initialization script
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function runInitScript(projectPath) {
  try {
    const initScriptPath = path.join(projectPath, 'scripts', 'init.sh');
    
    if (await fs.pathExists(initScriptPath)) {
      logger.startSpinner('Running initialization script...');
      
      // Make the script executable
      await fs.chmod(initScriptPath, 0o755);
      
      // Run the script
      await execa('bash', [initScriptPath], {
        cwd: projectPath,
        stdio: 'inherit'
      });
      
      logger.succeedSpinner('Initialization script completed successfully');
    }
  } catch (error) {
    logger.failSpinner('Failed to run initialization script');
    errorHandler.handleError(error);
    throw error;
  }
}

/**
 * Initialize Git repository
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function initializeGit(projectPath) {
  try {
    logger.startSpinner('Initializing Git repository...');
    
    // Check if Git is installed
    try {
      execSync('git --version', { stdio: 'ignore' });
    } catch (error) {
      logger.warn('Git is not installed. Skipping Git initialization.');
      return;
    }
    
    // Initialize Git repository
    await execa('git', ['init'], {
      cwd: projectPath,
      stdio: 'inherit'
    });
    
    // Create initial commit
    await execa('git', ['add', '.'], {
      cwd: projectPath,
      stdio: 'inherit'
    });
    
    await execa('git', ['commit', '-m', 'Initial commit from create-supabase-next'], {
      cwd: projectPath,
      stdio: 'inherit'
    });
    
    logger.succeedSpinner('Git repository initialized successfully');
  } catch (error) {
    logger.failSpinner('Failed to initialize Git repository');
    logger.warn('Git initialization failed, but the project was created successfully.');
  }
}

/**
 * Initialize project
 * @param {Object} options - Initialization options
 * @param {string} options.projectName - Name of the project
 * @param {string} options.projectPath - Path to the project
 * @param {string} options.templateRepo - GitHub repository URL for the template
 * @returns {Promise<void>}
 */
async function initialize(options) {
  const { projectName, projectPath, templateRepo } = options;
  
  try {
    // Run create-next-app
    await runCreateNextApp(projectName, projectPath);
    
    // Validate repository URL before attempting to download
    logger.startSpinner(`Validating template repository: ${templateRepo}`);
    const isValidRepo = await templateDownloader.validateRepositoryUrl(templateRepo);
    
    if (!isValidRepo) {
      logger.failSpinner(`Invalid or inaccessible repository: ${templateRepo}`);
      logger.warn(`Falling back to default repository: https://github.com/JonasWIP/supanexttemplate`);
      
      // Fall back to the default repository
      const defaultTemplateRepo = 'https://github.com/JonasWIP/supanexttemplate';
      const templatePath = await templateDownloader.downloadTemplate(defaultTemplateRepo);
      
      // Copy template files to project
      await templateDownloader.copyTemplateFiles(templatePath, projectPath);
    } else {
      logger.succeedSpinner(`Template repository validated successfully`);
      
      // Download template files from the specified repository
      const templatePath = await templateDownloader.downloadTemplate(templateRepo);
      
      // Copy template files to project
      await templateDownloader.copyTemplateFiles(templatePath, projectPath);
    }
    
    // Initialize Supabase
    await initializeSupabase(projectPath);
    
    // Install additional dependencies
    await installDependencies(projectPath);
    
    // Initialize Tailwind CSS
    await initializeTailwind(projectPath);
    
    // Configure environment variables
    await configureEnvironment(projectPath);
    
    // Run initialization script
    await runInitScript(projectPath);
    
    // Initialize Git repository
    await initializeGit(projectPath);
    
  } catch (error) {
    logger.error('Project initialization failed');
    throw error;
  }
}

module.exports = {
  initialize
};