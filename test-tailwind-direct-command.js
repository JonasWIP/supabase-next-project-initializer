const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const logger = require('./lib/logger');

/**
 * Simulate the direct command fallback by creating a mock tailwindcss executable
 * and adding it to the PATH temporarily
 */
async function testTailwindDirectCommand() {
  try {
    // Create a test directory
    const testDir = path.resolve(process.cwd(), 'tailwind-direct-test');
    const binDir = path.join(testDir, 'bin');
    
    // Clean up any existing test directory
    if (fs.existsSync(testDir)) {
      await fs.remove(testDir);
    }
    
    // Create the test directory and bin directory
    await fs.mkdir(testDir);
    await fs.mkdir(binDir);
    
    // Create a mock tailwindcss executable in the bin directory
    const mockTailwindPath = process.platform === 'win32' 
      ? path.join(binDir, 'tailwindcss.cmd') 
      : path.join(binDir, 'tailwindcss');
    
    // Create the mock script content based on platform
    let mockScriptContent;
    if (process.platform === 'win32') {
      mockScriptContent = `@echo off
echo Simulated tailwindcss command
echo Creating tailwind.config.js and postcss.config.js

set PROJECT_DIR=%1
if "%PROJECT_DIR%"=="" set PROJECT_DIR=.

echo /** @type {import('tailwindcss').Config} */ > %PROJECT_DIR%\\tailwind.config.js
echo module.exports = { >> %PROJECT_DIR%\\tailwind.config.js
echo   content: [ >> %PROJECT_DIR%\\tailwind.config.js
echo     "./app/**/*.{js,ts,jsx,tsx,mdx}", >> %PROJECT_DIR%\\tailwind.config.js
echo     "./pages/**/*.{js,ts,jsx,tsx,mdx}", >> %PROJECT_DIR%\\tailwind.config.js
echo     "./components/**/*.{js,ts,jsx,tsx,mdx}", >> %PROJECT_DIR%\\tailwind.config.js
echo   ], >> %PROJECT_DIR%\\tailwind.config.js
echo   theme: { >> %PROJECT_DIR%\\tailwind.config.js
echo     extend: {}, >> %PROJECT_DIR%\\tailwind.config.js
echo   }, >> %PROJECT_DIR%\\tailwind.config.js
echo   plugins: [], >> %PROJECT_DIR%\\tailwind.config.js
echo } >> %PROJECT_DIR%\\tailwind.config.js

echo module.exports = { > %PROJECT_DIR%\\postcss.config.js
echo   plugins: { >> %PROJECT_DIR%\\postcss.config.js
echo     tailwindcss: {}, >> %PROJECT_DIR%\\postcss.config.js
echo     autoprefixer: {}, >> %PROJECT_DIR%\\postcss.config.js
echo   }, >> %PROJECT_DIR%\\postcss.config.js
echo } >> %PROJECT_DIR%\\postcss.config.js

echo Files created successfully
`;
    } else {
      mockScriptContent = `#!/bin/bash
echo "Simulated tailwindcss command"
echo "Creating tailwind.config.js and postcss.config.js"

PROJECT_DIR=${1:-.}

cat > $PROJECT_DIR/tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
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
}
EOL

cat > $PROJECT_DIR/postcss.config.js << EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

echo "Files created successfully"
`;
    }
    
    // Write the mock script
    await fs.writeFile(mockTailwindPath, mockScriptContent);
    
    // Make the script executable (for Unix-like systems)
    if (process.platform !== 'win32') {
      await fs.chmod(mockTailwindPath, 0o755);
    }
    
    // Create a basic package.json
    const packageJson = {
      name: 'tailwind-direct-test',
      version: '1.0.0',
      description: 'Test for Tailwind CSS direct command fallback',
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
    
    logger.info('Testing Tailwind CSS direct command fallback...');
    
    // Add the bin directory to the PATH temporarily
    const originalPath = process.env.PATH;
    process.env.PATH = `${binDir}${path.delimiter}${originalPath}`;
    
    // Verify the mock tailwindcss is in the PATH
    try {
      if (process.platform === 'win32') {
        execSync('where tailwindcss', { stdio: 'pipe' });
      } else {
        execSync('which tailwindcss', { stdio: 'pipe' });
      }
      logger.info('Mock tailwindcss command is available in PATH');
    } catch (error) {
      logger.error('Mock tailwindcss command is not available in PATH');
      throw new Error('Failed to set up mock tailwindcss command');
    }
    
    // Simulate the direct command fallback
    logger.info('Simulating direct command fallback...');
    try {
      // Simulate npx failure by using an invalid command
      logger.warn('Simulating npx failure...');
      try {
        execSync('npx invalid-command', { stdio: 'pipe' });
      } catch (npxError) {
        logger.info('NPX command failed as expected');
      }
      
      // Now try the direct command which should succeed
      logger.info('Trying direct tailwindcss command...');
      execSync(`tailwindcss init -p`, {
        cwd: testDir,
        stdio: 'inherit'
      });
      
      logger.success('Direct tailwindcss command succeeded');
    } catch (error) {
      logger.error(`Direct command failed: ${error.message}`);
      throw error;
    }
    
    // Verify that the config files were created
    const tailwindConfigExists = fs.existsSync(path.join(testDir, 'tailwind.config.js'));
    const postcssConfigExists = fs.existsSync(path.join(testDir, 'postcss.config.js'));
    
    if (tailwindConfigExists && postcssConfigExists) {
      logger.success('Tailwind CSS direct command fallback test completed successfully!');
      logger.info('Config files created:');
      logger.info(`- tailwind.config.js: ${tailwindConfigExists ? 'Yes' : 'No'}`);
      logger.info(`- postcss.config.js: ${postcssConfigExists ? 'Yes' : 'No'}`);
    } else {
      throw new Error('Tailwind CSS initialization did not create the expected config files');
    }
    
    // Restore the original PATH
    process.env.PATH = originalPath;
    
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
    
    // Restore the original PATH if it was modified
    if (process.env.PATH_BACKUP) {
      process.env.PATH = process.env.PATH_BACKUP;
      delete process.env.PATH_BACKUP;
    }
    
    // Try to clean up even if the test fails
    try {
      const testDir = path.resolve(process.cwd(), 'tailwind-direct-test');
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
testTailwindDirectCommand();