const chalk = require('chalk');

/**
 * Handle general errors
 * @param {Error} error - Error object
 */
function handleError(error) {
  console.error(`\n${chalk.red('Error:')} ${error.message}`);
  
  if (error.stack && process.env.DEBUG) {
    console.error(`\n${chalk.gray(error.stack)}`);
  }
  
  console.error(`\n${chalk.yellow('If you believe this is a bug, please open an issue at:')}`);
  console.error(`${chalk.cyan('https://github.com/JonasWIP/supanexttemplate/issues')}\n`);
}

/**
 * Handle dependency errors
 * @param {string[]} missingDependencies - List of missing dependencies
 */
function handleDependencyError(missingDependencies) {
  console.error(`\n${chalk.red('Error:')} The following dependencies are missing:`);
  
  missingDependencies.forEach(dep => {
    console.error(`  - ${chalk.cyan(dep)}`);
  });
  
  console.error('\nPlease install the missing dependencies and try again:');
  
  missingDependencies.forEach(dep => {
    switch (dep) {
      case 'node':
        console.error(`  ${chalk.cyan('Node.js')}: https://nodejs.org/en/download/ (v14.0.0 or higher)`);
        break;
      case 'npm':
        console.error(`  ${chalk.cyan('npm')}: Included with Node.js installation`);
        break;
      case 'npx':
        console.error(`  ${chalk.cyan('npx')}: Included with npm 5.2.0 and higher`);
        break;
      case 'create-next-app':
        console.error(`  ${chalk.cyan('create-next-app')}: npm install -g create-next-app`);
        break;
      case 'supabase':
        console.error(`  ${chalk.cyan('Supabase CLI')}: Please install using instructions at https://github.com/supabase/cli#install-the-cli`);
        break;
      default:
        console.error(`  ${chalk.cyan(dep)}: Please install this dependency`);
    }
  });
  
  console.error('');
}

/**
 * Handle network errors
 * @param {Error} error - Error object
 */
function handleNetworkError(error) {
  console.error(`\n${chalk.red('Network Error:')} ${error.message}`);
  console.error(`\nPlease check your internet connection and try again.`);
  
  if (error.code === 'ENOTFOUND') {
    console.error(`\nCould not resolve hostname. Please check your DNS settings.`);
  } else if (error.code === 'ETIMEDOUT') {
    console.error(`\nConnection timed out. The server might be down or your internet connection is slow.`);
  }
  
  console.error('');
}

/**
 * Handle file system errors
 * @param {Error} error - Error object
 */
function handleFileSystemError(error) {
  console.error(`\n${chalk.red('File System Error:')} ${error.message}`);
  
  if (error.code === 'EACCES') {
    console.error(`\nPermission denied. Please check your file permissions.`);
  } else if (error.code === 'ENOENT') {
    console.error(`\nFile or directory not found. Please check the path.`);
  } else if (error.code === 'EEXIST') {
    console.error(`\nFile or directory already exists. Please choose a different name.`);
  }
  
  console.error('');
}

module.exports = {
  handleError,
  handleDependencyError,
  handleNetworkError,
  handleFileSystemError
};