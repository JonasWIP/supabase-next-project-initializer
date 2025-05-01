#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

const dependencyChecker = require('./lib/dependency-checker');
const templateDownloader = require('./lib/template-downloader');
const projectInitializer = require('./lib/project-initializer');
const errorHandler = require('./lib/error-handler');
const logger = require('./lib/logger');

// Package version
const packageJson = require('./package.json');

async function main() {
  try {
    // Configure CLI
    program
      .name('create-supabase-next')
      .description('Create a new Supabase + Next.js project with best practices')
      .version(packageJson.version)
      .argument('[project-name]', 'Name of the project')
      .option('-t, --template-repo <url>', 'GitHub repository URL for the template', 'https://github.com/JonasWIP/supanexttemplate')
      .option('--skip-dependency-check', 'Skip dependency checking', false)
      .parse(process.argv);

    // Get project name
    let projectName = program.args[0];
    const options = program.opts();

    // If no project name provided, prompt for it
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is the name of your project?',
          default: 'my-supabase-next-app',
          validate: (input) => {
            if (/^[a-zA-Z0-9-_]+$/.test(input)) return true;
            return 'Project name may only include letters, numbers, underscores and hashes.';
          }
        }
      ]);
      projectName = answers.projectName;
    }

    // Welcome message
    logger.welcome();
    logger.info(`Creating a new Supabase + Next.js project: ${chalk.cyan(projectName)}`);

    // Check dependencies
    if (!options.skipDependencyCheck) {
      const spinner = ora('Checking dependencies...').start();
      const dependencyCheckResult = await dependencyChecker.checkAll();
      
      if (!dependencyCheckResult.success) {
        spinner.fail('Dependency check failed');
        errorHandler.handleDependencyError(dependencyCheckResult.missing);
        process.exit(1);
      }
      
      spinner.succeed('All dependencies are installed');
    }

    // Create project directory
    const projectPath = path.resolve(process.cwd(), projectName);
    
    if (fs.existsSync(projectPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${projectName} already exists. Do you want to overwrite it?`,
          default: false
        }
      ]);
      
      if (!overwrite) {
        logger.error('Aborting installation');
        process.exit(1);
      }
      
      await fs.remove(projectPath);
    }

    // Initialize project
    await projectInitializer.initialize({
      projectName,
      projectPath,
      templateRepo: options.templateRepo
    });

    // Run setup script in the newly created project
    try {
      const spinner = ora('Running setup script in the new project...').start();
      await new Promise((resolve, reject) => {
        const child = require('child_process').spawn('npm', ['run', 'setup'], {
          cwd: projectPath,
          stdio: 'inherit',
          shell: true
        });
        
        child.on('close', (code) => {
          if (code === 0) {
            spinner.succeed('Setup completed successfully');
            resolve();
          } else {
            spinner.fail(`Setup script failed with code ${code}`);
            reject(new Error(`Setup script failed with code ${code}`));
          }
        });
        
        child.on('error', (err) => {
          spinner.fail(`Setup script failed: ${err.message}`);
          reject(err);
        });
      });
    } catch (error) {
      errorHandler.handleError(error);
      // Continue despite errors as the project might still be usable
      logger.warn('Setup script failed, but the project was created. You may need to run setup manually.');
    }

    // Success message
    logger.success(`
      ${chalk.green('Success!')} Created ${chalk.cyan(projectName)} at ${chalk.cyan(projectPath)}
      
      Inside that directory, you can run several commands:
      
        ${chalk.cyan('npm run dev')}
          Starts the development server.
      
        ${chalk.cyan('npm run build')}
          Builds the app for production.
      
        ${chalk.cyan('npm start')}
          Runs the built app in production mode.
      
        ${chalk.cyan('npx supabase start')}
          Starts the local Supabase development environment.
      
      We suggest that you begin by typing:
      
        ${chalk.cyan('cd')} ${projectName}
        ${chalk.cyan('npm run dev')}
      
      Happy coding!
    `);

    // Exit the process with success code
    process.exit(0);

  } catch (error) {
    errorHandler.handleError(error);
    process.exit(1);
  }
}

main();