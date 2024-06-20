import fs from 'node:fs/promises';
import yaml from 'js-yaml';

export async function yaml_parser(filePath: string): Promise<any> {
	try {
		const fileContent = await fs.readFile(filePath, 'utf-8');
		const data: any = yaml.load(fileContent);
		return data;
	} catch (error) {
		console.error(`Error reading YAML file ${filePath}:`, error);
		return null;
	}
}
