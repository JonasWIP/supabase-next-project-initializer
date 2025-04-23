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
    
    await executeWithRetry('npx', [
      'create-next-app',
      projectName,
      '--typescript',
      '--eslint',
      '--use-npm',
      '--yes'
    ], {}, 2, 180000); // Longer timeout for create-next-app as it can take time
    
    logger.succeedSpinner('Next.js app created successfully');
  } catch (error) {
    logger.failSpinner('Failed to create Next.js app');
    
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

/**
 * Initialize Supabase
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
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
 * Initialize Supabase
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function initializeSupabase(projectPath) {
  try {
    logger.startSpinner('Initializing Supabase...');
    
    try {
      // Try to initialize Supabase using npx with retry logic
      await executeWithRetry('npx', ['supabase', 'init'], {
        cwd: projectPath
      });
      
      logger.succeedSpinner('Supabase initialized successfully');
    } catch (npxError) {
      // Use the appropriate error handler based on the error type
      if (npxError.message.includes('context canceled') ||
          npxError.message.includes('timed out') ||
          npxError.code === 'ETIMEDOUT' ||
          npxError.signal) {
        errorHandler.handleProcessError(npxError);
      } else {
        logger.warn(`NPX initialization failed: ${npxError.message}. Trying direct command...`);
      }
      
      // If npx fails, try direct command if available
      try {
        await executeWithRetry('supabase', ['init'], {
          cwd: projectPath
        });
        
        logger.succeedSpinner('Supabase initialized successfully');
      } catch (directError) {
        // Use the appropriate error handler based on the error type
        if (directError.message.includes('context canceled') ||
            directError.message.includes('timed out') ||
            directError.code === 'ETIMEDOUT' ||
            directError.signal) {
          errorHandler.handleProcessError(directError);
        } else {
          logger.warn(`Direct command failed: ${directError.message}`);
        }
        
        // Check if this is a "context canceled" error
        if (directError.message.includes('context canceled')) {
          logger.warn('Detected "context canceled" error. This may indicate a process termination issue.');
          
          // Try one more time with a different approach
          try {
            // Use execSync as a last resort with a longer timeout
            logger.info('Attempting final initialization with alternative method...');
            require('child_process').execSync('supabase init', {
              cwd: projectPath,
              stdio: 'inherit',
              timeout: 120000
            });
            
            logger.succeedSpinner('Supabase initialized successfully with alternative method');
            return;
          } catch (finalError) {
            logger.warn(`Final attempt failed: ${finalError.message}`);
            
            // If the final attempt also fails with a process error, handle it appropriately
            if (finalError.message.includes('context canceled') ||
                finalError.message.includes('timed out') ||
                finalError.code === 'ETIMEDOUT' ||
                finalError.signal) {
              errorHandler.handleProcessError(finalError);
            }
          }
        }
        
        // Both methods failed
        throw new Error(
          'Failed to initialize Supabase. Please ensure Supabase CLI is installed correctly.\n' +
          'See installation instructions at: https://github.com/supabase/cli#install-the-cli'
        );
      }
    }
  } catch (error) {
    logger.failSpinner('Failed to initialize Supabase');
    
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

/**
 * Install additional dependencies
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function installDependencies(projectPath) {
  try {
    logger.startSpinner('Installing additional dependencies...');
    
    // Install Tailwind CSS and related packages
    try {
      await executeWithRetry('npm', [
        'install',
        '--save-dev',
        'tailwindcss',
        'postcss',
        'autoprefixer'
      ], {
        cwd: projectPath
      }, 3, 120000);
      
      // Install Supabase client
      await executeWithRetry('npm', [
        'install',
        '@supabase/supabase-js'
      ], {
        cwd: projectPath
      }, 3, 120000);
      
      logger.succeedSpinner('Dependencies installed successfully');
    } catch (npmError) {
      // Use appropriate error handler for the first attempt
      if (npmError.message.includes('context canceled') ||
          npmError.message.includes('timed out') ||
          npmError.code === 'ETIMEDOUT' ||
          npmError.signal) {
        errorHandler.handleProcessError(npmError);
      } else if (npmError.code === 'ENOTFOUND' ||
                 npmError.code === 'ECONNREFUSED' ||
                 npmError.code === 'ECONNRESET') {
        errorHandler.handleNetworkError(npmError);
      }
      
      // If npm install fails, try with --no-fund and --no-audit flags
      logger.warn(`Standard npm install failed: ${npmError.message}. Trying with additional flags...`);
      
      try {
        await executeWithRetry('npm', [
          'install',
          '--save-dev',
          '--no-fund',
          '--no-audit',
          'tailwindcss',
          'postcss',
          'autoprefixer'
        ], {
          cwd: projectPath
        }, 2, 120000);
        
        await executeWithRetry('npm', [
          'install',
          '--no-fund',
          '--no-audit',
          '@supabase/supabase-js'
        ], {
          cwd: projectPath
        }, 2, 120000);
        
        logger.succeedSpinner('Dependencies installed successfully with alternative flags');
      } catch (retryError) {
        // Use appropriate error handler for the retry attempt
        if (retryError.message.includes('context canceled') ||
            retryError.message.includes('timed out') ||
            retryError.code === 'ETIMEDOUT' ||
            retryError.signal) {
          errorHandler.handleProcessError(retryError);
        } else if (retryError.code === 'ENOTFOUND' ||
                   retryError.code === 'ECONNREFUSED' ||
                   retryError.code === 'ECONNRESET') {
          errorHandler.handleNetworkError(retryError);
        }
        
        throw retryError;
      }
    }
  } catch (error) {
    logger.failSpinner('Failed to install dependencies');
    
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

/**
 * Initialize Tailwind CSS
 * @param {string} projectPath - Path to the project
 * @returns {Promise<void>}
 */
async function initializeTailwind(projectPath) {
  try {
    logger.startSpinner('Initializing Tailwind CSS...');
    
    try {
      // Try to initialize Tailwind CSS using npx with retry logic
      await executeWithRetry('npx', ['tailwindcss', 'init', '-p'], {
        cwd: projectPath
      });
      
      logger.succeedSpinner('Tailwind CSS initialized successfully');
    } catch (npxError) {
      // Use the appropriate error handler based on the error type
      if (npxError.message.includes('context canceled') ||
          npxError.message.includes('timed out') ||
          npxError.code === 'ETIMEDOUT' ||
          npxError.signal) {
        errorHandler.handleProcessError(npxError);
      } else {
        logger.warn(`NPX initialization failed: ${npxError.message}. Trying direct command...`);
      }
      
      // If npx fails, try direct command if available
      try {
        // Try with direct tailwindcss command
        await executeWithRetry('tailwindcss', ['init', '-p'], {
          cwd: projectPath
        });
        
        logger.succeedSpinner('Tailwind CSS initialized successfully with direct command');
      } catch (directError) {
        // Use the appropriate error handler based on the error type
        if (directError.message.includes('context canceled') ||
            directError.message.includes('timed out') ||
            directError.code === 'ETIMEDOUT' ||
            directError.signal) {
          errorHandler.handleProcessError(directError);
        } else {
          logger.warn(`Direct command failed: ${directError.message}. Trying with local node_modules path...`);
        }
        
        // Try with explicit path to node_modules/.bin/tailwindcss
        try {
          const tailwindPath = path.join(projectPath, 'node_modules', '.bin', 'tailwindcss');
          await executeWithRetry(tailwindPath, ['init', '-p'], {
            cwd: projectPath
          });
          
          logger.succeedSpinner('Tailwind CSS initialized successfully with local path');
        } catch (localPathError) {
          // Use the appropriate error handler based on the error type
          if (localPathError.message.includes('context canceled') ||
              localPathError.message.includes('timed out') ||
              localPathError.code === 'ETIMEDOUT' ||
              localPathError.signal) {
            errorHandler.handleProcessError(localPathError);
          } else {
            logger.warn(`Local path command failed: ${localPathError.message}. Trying alternative method...`);
          }
          
          // Try one more time with a different approach
          try {
            // Use execSync as a last resort with a longer timeout
            logger.info('Attempting final initialization with alternative method...');
            
            // Create the tailwind.config.js and postcss.config.js files manually
            const tailwindConfigPath = path.join(projectPath, 'tailwind.config.js');
            const postcssConfigPath = path.join(projectPath, 'postcss.config.js');
            
            // Default tailwind.config.js content
            const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
            
            // Default postcss.config.js content
            const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
            
            // Write the config files
            fs.writeFileSync(tailwindConfigPath, tailwindConfig);
            fs.writeFileSync(postcssConfigPath, postcssConfig);
            
            logger.succeedSpinner('Tailwind CSS initialized successfully with alternative method');
            return;
          } catch (finalError) {
            logger.warn(`Final attempt failed: ${finalError.message}`);
            
            // If the final attempt also fails with a process error, handle it appropriately
            if (finalError.message.includes('context canceled') ||
                finalError.message.includes('timed out') ||
                finalError.code === 'ETIMEDOUT' ||
                finalError.signal) {
              errorHandler.handleProcessError(finalError);
            }
          }
          
          // All methods failed
          throw new Error(
            'Failed to initialize Tailwind CSS. Please ensure Tailwind CSS is installed correctly.\n' +
            'You may need to manually create tailwind.config.js and postcss.config.js files.'
          );
        }
      }
    }
  } catch (error) {
    logger.failSpinner('Failed to initialize Tailwind CSS');
    
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
    const isWindows = process.platform === 'win32';
    const initScriptPath = path.join(projectPath, 'scripts', isWindows ? 'init.ps1' : 'init.sh');
    
    if (await fs.pathExists(initScriptPath)) {
      logger.startSpinner('Running initialization script...');
      
      // Make the script executable (not needed for Windows)
      if (!isWindows) {
        await fs.chmod(initScriptPath, 0o755);
      }
      
      // Run the script with retry logic, using the appropriate shell
      if (isWindows) {
        // For Windows, use PowerShell to execute the PowerShell script
        await executeWithRetry('powershell', ['-ExecutionPolicy', 'Bypass', '-File', initScriptPath], {
          cwd: projectPath
        }, 2, 120000);
      } else {
        // For non-Windows platforms, use bash
        await executeWithRetry('bash', [initScriptPath], {
          cwd: projectPath
        }, 2, 120000);
      }
      
      logger.succeedSpinner('Initialization script completed successfully');
    }
  } catch (error) {
    logger.failSpinner('Failed to run initialization script');
    
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
    } else if (error.code === 'ENOENT' ||
               error.code === 'EACCES' ||
               error.code === 'EEXIST') {
      errorHandler.handleFileSystemError(error);
    } else {
      errorHandler.handleError(error);
    }
    
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
    
    // Initialize Git repository with retry logic
    try {
      await executeWithRetry('git', ['init'], {
        cwd: projectPath
      });
      
      // Create initial commit
      await executeWithRetry('git', ['add', '.'], {
        cwd: projectPath
      });
      
      await executeWithRetry('git', ['commit', '-m', 'Initial commit from create-supabase-next'], {
        cwd: projectPath
      });
      
      logger.succeedSpinner('Git repository initialized successfully');
    } catch (gitError) {
      // Git operations can fail for various reasons, but they're not critical
      // for the project setup, so we'll just log a warning
      logger.failSpinner('Failed to initialize Git repository');
      logger.warn(`Git initialization failed: ${gitError.message}`);
      logger.warn('Git initialization failed, but the project was created successfully.');
    }
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
  initialize,
  initializeTailwind,
  installDependencies
};