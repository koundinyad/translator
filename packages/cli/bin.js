#!/usr/bin/env node

const { execSync } = require('child_process');
const { chdir } = require('process');
const { existsSync, mkdirSync, appendFileSync } = require('fs');
const { resolve } = require('path');
const readline = require('readline');
const chalk = require('chalk');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const addToGitignore = (folder_name) => {
	try {
		const gitignorePath = resolve('.gitignore');
		if (existsSync(gitignorePath)) {
			appendFileSync(gitignorePath, `\n${folder_name}/`);
			console.log(chalk.bgGreen.white(`Added ${folder_name} to .gitignore`));
		} else {
			const content = `${folder_name}/\n`;
			appendFileSync(gitignorePath, content);
			console.log(chalk.bgGreen.white(`Created .gitignore and added ${folder_name} to it`));
		}
	} catch (error) {
		console.error(chalk.bgRed.white('Error:', error.message));
	}
};

const cloneRepository = (repo_url, folder_name) => {
	try {
		if (existsSync(folder_name)) {
			console.error(chalk.bgRed.white('Error: Folder', folder_name, 'already exists.'));
			return;
		}

		// Create the folder
		mkdirSync(folder_name);

		chdir(folder_name);

		execSync(`git clone --depth 1 ${repo_url} .`, { stdio: 'inherit' });

		// Delete the 'packages' folder and its contents
		const packagesPath = resolve('packages');
		if (existsSync(packagesPath)) {
			rmSync(packagesPath, { recursive: true });
			console.log(chalk.bgGreen.white('Deleted the "packages" folder and its contents'));
		}

		// Clone

		console.log(chalk.green('Repository cloned successfully!'));
		console.log(
			chalk.green(`
***********************
*┌─┐┬ ┬┌─┐┌─┐┌─┐┌─┐┌─┐*
*└─┐│ ││  │  ├┤ └─┐└─┐*
*└─┘└─┘└─┘└─┘└─┘└─┘└─┘*
***********************
`)
		);
		console.log(chalk.bgWhite('----------------------------------'));
		console.log('');
		console.log(chalk.bgBlue('Run the following commands to start the application:'));
		console.log(chalk.green(`cd ${folder_name}`));
		console.log(chalk.green(`npm install`));
		console.log(chalk.green(`npm run dev`));

		// Add folder_name to .gitignore
		addToGitignore(folder_name);

		// Install dependencies

		rl.question(chalk.yellow.bold('Do you want to install dependencies? (yes/no): '), (answer) => {
			if (answer.trim().toLowerCase() === 'yes' || answer.trim().toLowerCase() === 'y') {
				// Install dependencies
				console.log(chalk.bgBlue.white('Installing dependencies...'));
				execSync('npm install', { stdio: 'inherit' });
				console.log(chalk.bgBlue.white('Dependencies installed successfully!'));
			} else {
				console.log('');
				console.log(chalk.bgBlue('Run the following commands to start the application:'));
				console.log(chalk.green(`cd ${folder_name}`));
				console.log(chalk.green(`npm install`));
				console.log(chalk.green(`npm run dev`));
			}
			rl.close();
		});
	} catch (error) {
		console.error(chalk.bgRed.white('Error:', error.message));
	}
};

const repo_url = 'https://github.com/koundinyad/translator';

const folder_name = 'translator';

console.log(chalk.bgBlue.white('Cloning GitHub repository into the specified folder...'));

cloneRepository(repo_url, folder_name);
