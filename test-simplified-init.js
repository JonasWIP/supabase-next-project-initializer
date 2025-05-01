// Simple test script for the simplified initialization process
const path = require('path');
const fs = require('fs-extra');  // Using fs-extra for recursive directory removal
const projectInitializer = require('./lib/project-initializer');

// Set up test parameters
const testProjectName = 'test-supabase-next-app';
const testProjectPath = path.join(__dirname, testProjectName);
const templateRepo = 'https://github.com/JonasWIP/supanexttemplate';

// Run the initialization process
async function runTest() {
  try {
    console.log(`Starting test for simplified project initialization...`);
    console.log(`Project name: ${testProjectName}`);
    console.log(`Project path: ${testProjectPath}`);
    console.log(`Template repo: ${templateRepo}`);
    
    // Remove existing project directory if it exists
    if (fs.existsSync(testProjectPath)) {
      console.log(`Removing existing directory at ${testProjectPath}...`);
      await fs.remove(testProjectPath);
      console.log('Directory removed successfully.');
    }
    
    // Run the initialize function
    await projectInitializer.initialize({
      projectName: testProjectName,
      projectPath: testProjectPath,
      templateRepo
    });
    
    // Check if project was created successfully
    if (fs.existsSync(testProjectPath)) {
      if (fs.existsSync(path.join(testProjectPath, 'package.json'))) {
        console.log('✅ Test passed: Project was created successfully!');
        console.log('Project structure:');
        listDirectoryContents(testProjectPath, '', 1);
      } else {
        console.error('❌ Test failed: package.json file not found in project directory');
      }
    } else {
      console.error('❌ Test failed: Project directory not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

// Helper function to list directory contents
function listDirectoryContents(dirPath, prefix, depth) {
  if (depth > 2) return; // Limit depth to avoid too much output
  
  const items = fs.readdirSync(dirPath);
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    console.log(`${prefix}${isLast ? '└── ' : '├── '}${item}${stats.isDirectory() ? '/' : ''}`);
    
    if (stats.isDirectory()) {
      listDirectoryContents(
        itemPath, 
        `${prefix}${isLast ? '    ' : '│   '}`, 
        depth + 1
      );
    }
  });
}

runTest();