#!/usr/bin/env node

import fs from 'fs';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

async function main() {
	const currentDirectory = process.cwd();

	const answers = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'proceedDownload',
			message: `Proceed download oss-translator in ${currentDirectory}?`,
			default: true
		}
	]);

	if (answers.proceedDownload) {
		// Clone the repository
		const cloneCommand = 'git clone https://github.com/koundinyad/translator.git';
		console.log('Cloning repository...');
		await execAsync(cloneCommand);

		console.log('oss-translator downloaded successfully.');

		// Add 'translator' directory to .gitignore
		const gitignorePath = path.join(currentDirectory, '.gitignore');
		fs.appendFileSync(gitignorePath, 'translator\n', 'utf8');

		console.log('Added "translator" directory to .gitignore.');

		console.log('To run the project, follow these steps:');
		console.log('1. Change directory to the cloned repository:');
		console.log('   cd translator');
		console.log('2. Install dependencies:');
		console.log('   npm install');
		console.log('3. Run the development server:');
		console.log('   npm run dev');
	}
}

main();
