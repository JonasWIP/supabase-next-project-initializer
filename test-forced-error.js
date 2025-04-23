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
 * Simulate a "context canceled" error by starting a process and then killing it
 * @param {string} projectPath - Path to the project
 * @returns {Promise<boolean>} - Whether the error was handled correctly
 */
async function simulateContextCanceledError(projectPath) {
  return new Promise(async (resolve) => {
    logger.startSpinner('Starting Supabase initialization with forced termination...');
    
    try {
      // Start the Supabase init process with execa
      const supaProcess = execa('npx', ['supabase', 'init'], {
        cwd: projectPath,
        stdio: ['pipe', 'pipe', 'pipe'],
        buffer: false
      });
      
      // Set up output handling
      if (supaProcess.stdout) {
        supaProcess.stdout.on('data', (data) => {
          process.stdout.write(data);
        });
      }
      
      if (supaProcess.stderr) {
        supaProcess.stderr.on('data', (data) => {
          process.stderr.write(data);
        });
      }
      
      // Kill the process after a short delay to simulate a "context canceled" error
      setTimeout(() => {
        logger.warn('Forcibly terminating the Supabase process to simulate a "context canceled" error...');
        supaProcess.kill('SIGTERM');
      }, 2000);
      
      // Wait for the process to exit
      try {
        await supaProcess;
      } catch (error) {
        logger.failSpinner(`Supabase process terminated: ${error.message}`);
        
        // Now try to recover using our robust initialization function
        logger.info('Attempting recovery with robust initialization...');
        
        try {
          // Use execSync with a longer timeout as a recovery mechanism
          execSync('supabase init', {
            cwd: projectPath,
            stdio: 'inherit',
            timeout: 120000
          });
          
          logger.success('Recovery successful! Supabase initialized with alternative method.');
          resolve(true);
        } catch (recoveryError) {
          logger.error(`Recovery failed: ${recoveryError.message}`);
          
          // Use the appropriate error handler based on the error type
          if (recoveryError.message.includes('context canceled') ||
              recoveryError.message.includes('timed out') ||
              recoveryError.code === 'ETIMEDOUT' ||
              recoveryError.signal) {
            errorHandler.handleProcessError(recoveryError);
          } else if (recoveryError.code === 'ENOTFOUND' ||
                    recoveryError.code === 'ECONNREFUSED' ||
                    recoveryError.code === 'ECONNRESET') {
            errorHandler.handleNetworkError(recoveryError);
          } else {
            errorHandler.handleError(recoveryError);
          }
          
          resolve(false);
        }
      }
    } catch (initError) {
      logger.failSpinner(`Failed to start Supabase process: ${initError.message}`);
      logger.error('Could not simulate context canceled error due to initialization failure');
      resolve(false);
    }
  });
}

async function runForcedErrorTest() {
  try {
    logger.info('Running forced "context canceled" error test...');
    
    // Create test directory
    const testDir = path.resolve(process.cwd(), 'forced-error-test');
    
    // Clean up any existing test directory
    if (fs.existsSync(testDir)) {
      await fs.remove(testDir);
    }
    
    // Create the test directory
    await fs.mkdir(testDir);
    
    // Run the test
    const recoverySuccessful = await simulateContextCanceledError(testDir);
    
    // Report results
    if (recoverySuccessful) {
      logger.success('Forced error test passed! The system successfully recovered from a simulated "context canceled" error.');
    } else {
      logger.warn('Forced error test completed, but recovery was not successful. Check logs for details.');
    }
    
    // Clean up
    await fs.remove(testDir);
  } catch (error) {
    logger.error(`Forced error test failed: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runForcedErrorTest();