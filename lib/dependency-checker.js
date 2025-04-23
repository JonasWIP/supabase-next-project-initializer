const { execSync } = require('child_process');
const semver = require('semver');
const fs = require('fs-extra');
const path = require('path');

/**
 * Check if a command is available in the PATH
 * @param {string} command - Command to check
 * @returns {boolean} - Whether the command is available
 */
function commandExists(command) {
  try {
    execSync(`${process.platform === 'win32' ? 'where' : 'which'} ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if Node.js version is compatible
 * @returns {boolean} - Whether Node.js version is compatible
 */
function checkNodeVersion() {
  const requiredVersion = '14.0.0';
  const currentVersion = process.version;
  
  return semver.gte(currentVersion, requiredVersion);
}

/**
 * Check if npm is installed
 * @returns {boolean} - Whether npm is installed
 */
function checkNpm() {
  return commandExists('npm');
}

/**
 * Check if npx is installed
 * @returns {boolean} - Whether npx is installed
 */
function checkNpx() {
  return commandExists('npx');
}

/**
 * Check if create-next-app is available
 * @returns {boolean} - Whether create-next-app is available
 */
function checkCreateNextApp() {
  try {
    execSync('npx --no-install create-next-app --help', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if Supabase CLI is installed
 * @returns {boolean} - Whether Supabase CLI is installed
 */
function checkSupabase() {
  try {
    // Try to execute a simple Supabase CLI command
    execSync('supabase --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    // Check if it's installed via npm as a dev dependency
    try {
      execSync('npx supabase --version', { stdio: 'ignore' });
      return true;
    } catch (npxError) {
      return false;
    }
  }
}

/**
 * Check all dependencies
 * @returns {Object} - Result of dependency check
 */
async function checkAll() {
  const nodeVersion = checkNodeVersion();
  const npm = checkNpm();
  const npx = checkNpx();
  const createNextApp = checkCreateNextApp();
  const supabase = checkSupabase();
  
  const missing = [];
  
  if (!nodeVersion) missing.push('node');
  if (!npm) missing.push('npm');
  if (!npx) missing.push('npx');
  if (!createNextApp) missing.push('create-next-app');
  if (!supabase) missing.push('supabase');
  
  return {
    success: missing.length === 0,
    missing
  };
}

module.exports = {
  checkAll,
  checkNodeVersion,
  checkNpm,
  checkNpx,
  checkCreateNextApp,
  checkSupabase
};