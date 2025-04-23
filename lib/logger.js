const chalk = require('chalk');
const ora = require('ora');

let spinner = null;

/**
 * Display welcome message
 */
function welcome() {
  const message = `
  ┌─────────────────────────────────────────────────┐
  │                                                 │
  │   ${chalk.cyan('Create Supabase + Next.js App')}                  │
  │                                                 │
  │   A CLI tool to create a Supabase + Next.js     │
  │   project with best practices.                  │
  │                                                 │
  └─────────────────────────────────────────────────┘
  `;
  
  console.log(message);
}

/**
 * Log an informational message
 * @param {string} message - Message to log
 */
function info(message) {
  console.log(`${chalk.blue('info')} ${message}`);
}

/**
 * Log a success message
 * @param {string} message - Message to log
 */
function success(message) {
  console.log(`${chalk.green('success')} ${message}`);
}

/**
 * Log an error message
 * @param {string} message - Message to log
 */
function error(message) {
  console.error(`${chalk.red('error')} ${message}`);
}

/**
 * Log a warning message
 * @param {string} message - Message to log
 */
function warn(message) {
  console.warn(`${chalk.yellow('warn')} ${message}`);
}

/**
 * Start a spinner with the given message
 * @param {string} message - Message to display
 * @returns {Object} - Spinner instance
 */
function startSpinner(message) {
  if (spinner) {
    spinner.stop();
  }
  
  spinner = ora(message).start();
  return spinner;
}

/**
 * Stop the current spinner
 */
function stopSpinner() {
  if (spinner) {
    spinner.stop();
    spinner = null;
  }
}

/**
 * Update the current spinner text
 * @param {string} message - New message to display
 */
function updateSpinner(message) {
  if (spinner) {
    spinner.text = message;
  }
}

/**
 * Mark the current spinner as succeeded
 * @param {string} message - Success message
 */
function succeedSpinner(message) {
  if (spinner) {
    spinner.succeed(message);
    spinner = null;
  }
}

/**
 * Mark the current spinner as failed
 * @param {string} message - Failure message
 */
function failSpinner(message) {
  if (spinner) {
    spinner.fail(message);
    spinner = null;
  }
}

module.exports = {
  welcome,
  info,
  success,
  error,
  warn,
  startSpinner,
  stopSpinner,
  updateSpinner,
  succeedSpinner,
  failSpinner
};