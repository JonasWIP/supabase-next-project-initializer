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
 * Initialize Supabase with a short timeout to increase chance of timeout errors
 * @param {string} projectPath - Path to the project
 * @param {number} instanceId - Instance identifier for logging
 * @returns {Promise<void>}
 */
async function initializeSupabaseWithShortTimeout(projectPath, instanceId) {
  try {
    logger.startSpinner(`[Instance ${instanceId}] Initializing Supabase...`);
    
    // Artificially introduce a delay to increase chance of race conditions
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    try {
      // Try to initialize Supabase using npx with a short timeout to increase chance of timeout errors
      await executeWithRetry('npx', ['supabase', 'init'], {
        cwd: projectPath
      }, 2, 5000); // Short timeout to increase chance of timeout errors
      
      logger.succeedSpinner(`[Instance ${instanceId}] Supabase initialized successfully`);
    } catch (npxError) {
      // Use the appropriate error handler based on the error type
      if (npxError.message.includes('context canceled') ||
          npxError.message.includes('timed out') ||
          npxError.code === 'ETIMEDOUT' ||
          npxError.signal) {
        logger.warn(`[Instance ${instanceId}] Detected error: ${npxError.message}`);
        errorHandler.handleProcessError(npxError);
      } else {
        logger.warn(`[Instance ${instanceId}] NPX initialization failed: ${npxError.message}. Trying direct command...`);
      }
      
      // If npx fails, try direct command if available
      try {
        await executeWithRetry('supabase', ['init'], {
          cwd: projectPath
        }, 2, 10000);
        
        logger.succeedSpinner(`[Instance ${instanceId}] Supabase initialized successfully with direct command`);
      } catch (directError) {
        // Use the appropriate error handler based on the error type
        if (directError.message.includes('context canceled') ||
            directError.message.includes('timed out') ||
            directError.code === 'ETIMEDOUT' ||
            directError.signal) {
          logger.warn(`[Instance ${instanceId}] Detected error: ${directError.message}`);
          errorHandler.handleProcessError(directError);
        } else {
          logger.warn(`[Instance ${instanceId}] Direct command failed: ${directError.message}`);
        }
        
        // Check if this is a "context canceled" error
        if (directError.message.includes('context canceled')) {
          logger.warn(`[Instance ${instanceId}] Detected "context canceled" error. This may indicate a process termination issue.`);
          
          // Try one more time with a different approach
          try {
            // Use execSync as a last resort with a longer timeout
            logger.info(`[Instance ${instanceId}] Attempting final initialization with alternative method...`);
            execSync('supabase init', {
              cwd: projectPath,
              stdio: 'inherit',
              timeout: 120000
            });
            
            logger.succeedSpinner(`[Instance ${instanceId}] Supabase initialized successfully with alternative method`);
            return;
          } catch (finalError) {
            logger.warn(`[Instance ${instanceId}] Final attempt failed: ${finalError.message}`);
            
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
          `[Instance ${instanceId}] Failed to initialize Supabase. Please ensure Supabase CLI is installed correctly.\n` +
          'See installation instructions at: https://github.com/supabase/cli#install-the-cli'
        );
      }
    }
  } catch (error) {
    logger.failSpinner(`[Instance ${instanceId}] Failed to initialize Supabase`);
    
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

async function runStressTest() {
  try {
    logger.info('Running Supabase initialization stress test...');
    
    // Create test directories
    const testDirs = [];
    const numInstances = 3; // Run 3 instances concurrently
    
    for (let i = 0; i < numInstances; i++) {
      const testDir = path.resolve(process.cwd(), `supabase-stress-test-${i}`);
      
      // Clean up any existing test directory
      if (fs.existsSync(testDir)) {
        await fs.remove(testDir);
      }
      
      // Create the test directory
      await fs.mkdir(testDir);
      testDirs.push(testDir);
    }
    
    // Run multiple instances concurrently
    const results = await Promise.allSettled(
      testDirs.map((dir, index) => initializeSupabaseWithShortTimeout(dir, index))
    );
    
    // Analyze results
    let successCount = 0;
    let failureCount = 0;
    let contextCanceledCount = 0;
    let timeoutCount = 0;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
        logger.success(`Instance ${index} completed successfully`);
      } else {
        failureCount++;
        logger.error(`Instance ${index} failed: ${result.reason.message}`);
        
        if (result.reason.message.includes('context canceled')) {
          contextCanceledCount++;
        } else if (result.reason.message.includes('timed out')) {
          timeoutCount++;
        }
      }
    });
    
    // Report results
    logger.info(`
Stress Test Results:
- Total instances: ${numInstances}
- Successful: ${successCount}
- Failed: ${failureCount}
- Context canceled errors: ${contextCanceledCount}
- Timeout errors: ${timeoutCount}
    `);
    
    // Clean up
    for (const dir of testDirs) {
      await fs.remove(dir);
    }
    
    if (failureCount === 0) {
      logger.success('Stress test completed successfully! All instances handled potential errors correctly.');
    } else {
      logger.warn(`Stress test completed with ${failureCount} failures. Check logs for details.`);
    }
  } catch (error) {
    logger.error(`Stress test failed: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runStressTest();