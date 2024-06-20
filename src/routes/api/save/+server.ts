import fs from 'node:fs/promises';
import { json } from '@sveltejs/kit';
import yaml from 'js-yaml';
import { config } from '$translator/translator.config.js';

interface TranslationItem {
	file_path: string;
	file_type: string;
	last_updated: string;
	status: string;
}

export async function POST({ request }) {
	const body = await request.json();
	const { format, target_path, content, status } = body;

	const t5: TranslationItem[] = JSON.parse(await fs.readFile(config.root_dir + 't5.json', 'utf8'));

	if (format == 'mdx') {
		fs.writeFile(target_path, content.content, 'utf8'); // writing to file
	} else if (format == 'yaml') {
		fs.writeFile(
			target_path,
			yaml.dump(content.content, {
				sortKeys: true,
				styles: {
					'!!bool': 'lowercase'
				},
				noCompatMode: true
			}),
			'utf8'
		);
	}

	// console.log({ target_path });

	console.log(await fs.access(config.root_dir + 't5.json'));

	const foundItem = t5.find((item) => item.file_path === target_path);
	if (foundItem) {
		foundItem.last_updated = new Date().toISOString(); // Update the type of last_updated
	} else {
		t5.push({
			file_path: target_path,
			file_type: format,
			last_updated: new Date().toISOString(), // Update the type of last_updated
			status
		});
	}
	await fs.writeFile(config.root_dir + 't5.json', JSON.stringify(t5, null, 2), 'utf8');

	// console.log(body);
	return json({ message: 'Hello from the server!' });
}
