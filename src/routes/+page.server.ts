import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '$translator/translator.config.js';
import package_json from '$root/package.json';
import { does_file_exist } from '../lib';

const { include } = config;

export const ssr = false;

export async function load({ url }: { url: URL }) {
	const project_name = package_json.name;

	const { root_dir } = config;

	try {
		const content_directories = await get_content_directories(root_dir, include);

		// await create_json(content_directories);
		return {
			directories: content_directories,
			project: {
				name: project_name
			},
			page_data: {
				search_params: {
					q: url.searchParams.get('q')
				}
			}
		};
	} catch (error) {
		console.error('Error:', error);
		return {
			error
		};
	}
}

async function get_content_directories(
	base_path: string,
	included_dirs: string[] = []
): Promise<BaseData[]> {
	try {
		const files = await fs.readdir(base_path);

		const content_directories = await Promise.all(
			files.map(async (file: string) => {
				const relative_path = path.join(base_path, file);
				const stats = await fs.stat(relative_path);
				const isDirectory = stats.isDirectory();
				const includeIndex = included_dirs.indexOf(file);
				return isDirectory && includeIndex !== -1 ? file : null;
			})
		);

		const directories = content_directories.filter((dir: string): dir is string => dir !== null);

		const language_directories = await Promise.all(
			directories.map(async (dir: string | null) => {
				const content_path = path.join(base_path, dir);

				const en_dirs = await read_files(path.join(content_path, 'en'));

				const lang_directories = await fs.readdir(content_path);

				return {
					dir_name: dir,
					en_subdirs: en_dirs,
					languages: lang_directories.filter(
						(lang_dir: string) => lang_dir.length === 2 && lang_dir !== 'en'
					)
				};
			})
		);

		return language_directories;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

async function read_files(contentPath: string, displayPath: string = ''): Promise<EnFiles[]> {
	try {
		const items = await fs.readdir(contentPath);
		let files: EnFiles[] = [];

		const does_t5_exist = await does_file_exist(config.root_dir + 't5.json');

		if (!does_t5_exist) {
			await fs.writeFile(config.root_dir + 't5.json', JSON.stringify([]), 'utf8');
		}
		const statusData = await fs.readFile(path.join(config.root_dir, 't5.json'), 'utf-8');
		const statusMap = JSON.parse(statusData);

		for (const item of items) {
			const itemPath = path.join(contentPath, item);
			const stat = await fs.stat(itemPath);
			const fileType = stat.isDirectory() ? 'directory' : path.extname(item).toLowerCase().slice(1);

			if (fileType !== 'directory' && ['md', 'mdx', 'yaml'].includes(fileType)) {
				const displayPath = path
					.join(contentPath.replace(config.root_dir, ''), item)
					.replace(/^\/+/, ''); // Remove leading slash

				// Find status based on file_path from statusMap
				const statusItem = statusMap.find(
					(statusObj: { file_path: string; status: string }) => statusObj.file_path === itemPath
				);

				files.push({
					filename: item,
					title: displayPath.replace('/en', ''),
					path: itemPath.replace(config.root_dir, ''),
					format: fileType,
					full_path: contentPath,
					paths: {
						absolute: contentPath,
						formatted: itemPath.replace(config.root_dir, '')
					},
					status: statusItem ? statusItem.status : 'unknown' // Default to 'unknown' if status not found
				});
			} else if (fileType === 'directory') {
				const nestedFiles = await read_files(itemPath, displayPath);
				files = files.concat(nestedFiles);
			}
		}

		files.sort((a, b) => {
			const parentDirA = path.dirname(a.title);
			const parentDirB = path.dirname(b.title);
			const comparison = parentDirA.localeCompare(parentDirB);
			if (comparison === 0) {
				return a.filename.localeCompare(b.filename);
			}
			return comparison;
		});

		return files;
	} catch (error) {
		console.error('Error reading files:', error);
		return [];
	}
}

// async function create_json(content_dirs) {
// 	try {
// 		const filesData = [];
// 		for (const directory of content_dirs) {
// 			for (const langDir of directory.languages) {
// 				const langDirPath = path.join(config.root_dir, directory.dir_name, langDir);
// 				const enDirPath = path.join(langDirPath, 'en'); // Include /en/ directory
// 				const langFiles = await read_files(enDirPath); // Read files from /en/ directory
// 				filesData.push(
// 					...langFiles.map((file) => ({
// 						path: file.path,
// 						last_updated: null,
// 						status: 'pending'
// 					}))
// 				);
// 			}
// 		}
// 		const combinedJsonFilePath = path.join(config.root_dir, 'translation.json');
// 		await fs.writeFile(combinedJsonFilePath, JSON.stringify(filesData, null, 2));
// 		console.log(`Created combined JSON file`);
// 	} catch (error) {
// 		console.error('Error creating combined JSON file:', error);
// 	}
// }
