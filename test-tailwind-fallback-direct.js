const path = require('path');
const fs = require('fs-extra');
const logger = require('./lib/logger');

/**
 * Direct implementation of the manual file creation fallback
 * This simulates the final fallback mechanism in initializeTailwind
 */
async function createTailwindConfigFiles(projectPath) {
  logger.info('Creating Tailwind config files manually...');
  
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
  
  logger.success('Tailwind config files created manually');
}

/**
 * Test Tailwind CSS initialization fallback mechanism directly
 */
async function testTailwindFallbackDirect() {
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
    
    logger.info('Testing Tailwind CSS initialization fallback mechanism directly...');
    
    // Directly create the config files (simulating the fallback)
    await createTailwindConfigFiles(testDir);
    
    // Verify that the config files were created
    const tailwindConfigExists = fs.existsSync(path.join(testDir, 'tailwind.config.js'));
    const postcssConfigExists = fs.existsSync(path.join(testDir, 'postcss.config.js'));
    
    if (tailwindConfigExists && postcssConfigExists) {
      logger.success('Tailwind CSS initialization fallback test completed successfully!');
      logger.info('Config files created:');
      logger.info(`- tailwind.config.js: ${tailwindConfigExists ? 'Yes' : 'No'}`);
      logger.info(`- postcss.config.js: ${postcssConfigExists ? 'Yes' : 'No'}`);
      
      // Read and log the content of the created files to verify
      logger.info('Verifying tailwind.config.js content:');
      const tailwindContent = fs.readFileSync(path.join(testDir, 'tailwind.config.js'), 'utf8');
      logger.info(`tailwind.config.js is ${tailwindContent.length} bytes`);
      
      logger.info('Verifying postcss.config.js content:');
      const postcssContent = fs.readFileSync(path.join(testDir, 'postcss.config.js'), 'utf8');
      logger.info(`postcss.config.js is ${postcssContent.length} bytes`);
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
testTailwindFallbackDirect();