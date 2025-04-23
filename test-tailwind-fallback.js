const path = require('path');
const fs = require('fs-extra');
const logger = require('./lib/logger');
const { initializeTailwind } = require('./lib/project-initializer');

/**
 * Mock the executeWithRetry function to always fail
 * This will force the initializeTailwind function to use the manual file creation fallback
 */
jest.mock('./lib/project-initializer', () => {
  // Get the actual module
  const originalModule = jest.requireActual('./lib/project-initializer');
  
  // Override the executeWithRetry function to always fail
  const mockedModule = {
    ...originalModule,
    executeWithRetry: jest.fn().mockRejectedValue(new Error('Forced failure for testing'))
  };
  
  return mockedModule;
});

/**
 * Test Tailwind CSS initialization fallback mechanism
 */
async function testTailwindFallback() {
  try {
    // Create a test directory
    const testDir = path.resolve(process.cwd(), 'tailwind-fallback-test');
    
    // Clean up any existing test directory
    if (fs.existsSync(testDir)) {
      await fs.remove(testDir);
    }
    
    // Create the test directory
    await fs.mkdir(testDir);
    
    // Create a basic package.json
    const packageJson = {
      name: 'tailwind-fallback-test',
      version: '1.0.0',
      description: 'Test for Tailwind CSS initialization fallback',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1'
      },
      keywords: [],
      author: '',
      license: 'ISC'
    };
    
    await fs.writeFile(
      path.join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    logger.info('Testing Tailwind CSS initialization fallback mechanism...');
    
    // Test the Tailwind CSS initialization
    logger.info('Testing Tailwind CSS initialization with forced failures...');
    await initializeTailwind(testDir);
    
    // Verify that the config files were created
    const tailwindConfigExists = fs.existsSync(path.join(testDir, 'tailwind.config.js'));
    const postcssConfigExists = fs.existsSync(path.join(testDir, 'postcss.config.js'));
    
    if (tailwindConfigExists && postcssConfigExists) {
      logger.success('Tailwind CSS initialization fallback test completed successfully!');
      logger.info('Config files created:');
      logger.info(`- tailwind.config.js: ${tailwindConfigExists ? 'Yes' : 'No'}`);
      logger.info(`- postcss.config.js: ${postcssConfigExists ? 'Yes' : 'No'}`);
    } else {
      throw new Error('Tailwind CSS initialization did not create the expected config files');
    }
    
    // Clean up
    logger.info('Cleaning up test directory...');
    await fs.remove(testDir);
    logger.success('Test cleanup completed');
    
    // Force exit after a short delay to allow logs to be written
    logger.info('Test completed, forcing exit in 1 second...');
    setTimeout(() => {
      logger.info('Exiting process');
      process.exit(0);
    }, 1000);
    
  } catch (error) {
    logger.error(`Test failed: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    
    // Try to clean up even if the test fails
    try {
      const testDir = path.resolve(process.cwd(), 'tailwind-fallback-test');
      if (fs.existsSync(testDir)) {
        await fs.remove(testDir);
        logger.info('Test directory cleaned up after failure');
      }
    } catch (cleanupError) {
      logger.warn(`Failed to clean up test directory: ${cleanupError.message}`);
    }
    
    // Force exit with error code
    process.exit(1);
  }
}

// Run the test
testTailwindFallback();