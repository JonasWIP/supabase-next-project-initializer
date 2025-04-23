const chalk = require('chalk');

/**
 * Handle general errors
 * @param {Error} error - Error object
 */
function handleError(error) {
  console.error(`\n${chalk.red('Error:')} ${error.message}`);
  
  // Special handling for "context canceled" errors
  if (error.message.includes('context canceled')) {
    console.error(`\n${chalk.yellow('This appears to be a "context canceled" error, which can occur when a process is terminated unexpectedly.')}`);
    console.error(`The system will automatically retry the operation with different methods.`);
  } else if (error.message.includes('timed out')) {
    console.error(`\n${chalk.yellow('The operation timed out. This could be due to slow network or system resources.')}`);
    console.error(`The system will automatically retry with increased timeouts.`);
  }
  
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
  } else if (error.message.includes('context canceled')) {
    console.error(`\n${chalk.yellow('This appears to be a "context canceled" error, which can occur when a process is terminated unexpectedly.')}`);
    console.error(`The system will automatically retry the operation with different methods.`);
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

/**
 * Handle process errors
 * @param {Error} error - Error object
 */
function handleProcessError(error) {
  console.error(`\n${chalk.red('Process Error:')} ${error.message}`);
  
  if (error.message.includes('context canceled')) {
    console.error(`\n${chalk.yellow('A "context canceled" error occurred. This typically happens when:')}`);
    console.error(`- A process was terminated unexpectedly`);
    console.error(`- There was a race condition in process execution`);
    console.error(`- The system is under heavy load`);
    console.error(`\nThe system will automatically retry with alternative methods.`);
  } else if (error.code === 'ENOENT') {
    console.error(`\nCommand not found. Please ensure the required tools are installed.`);
  } else if (error.signal) {
    console.error(`\nProcess was terminated with signal: ${error.signal}`);
  }
  
  console.error('');
}

module.exports = {
  handleError,
  handleDependencyError,
  handleNetworkError,
  handleFileSystemError,
  handleProcessError
};