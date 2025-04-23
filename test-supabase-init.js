#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const execa = require('execa');
const logger = require('./lib/logger');
const errorHandler = require('./lib/error-handler');

// Enable debug mode for more detailed error information
process.env.DEBUG = 'true';

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
 * Initialize Supabase directly
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
            execSync('supabase init', {
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

async function testSupabaseInit() {
  try {
    // Create a test directory
    const testDir = path.resolve(process.cwd(), 'supabase-init-test');
    
    // Clean up any existing test directory
    if (fs.existsSync(testDir)) {
      await fs.remove(testDir);
    }
    
    // Create the test directory
    await fs.mkdir(testDir);
    
    logger.info('Testing Supabase initialization with retry logic...');
    
    // Call the initializeSupabase function directly
    await initializeSupabase(testDir);
    
    logger.success('Supabase initialization test completed successfully!');
    
    // Clean up
    await fs.remove(testDir);
  } catch (error) {
    logger.error(`Test failed: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

testSupabaseInit();