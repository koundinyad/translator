import fs from 'node:fs/promises';
import { error, redirect } from '@sveltejs/kit';

import { config } from '$translator/translator.config.js';
import mdx_parser from '$lib/parsers/mdx-parser';
import matter from 'gray-matter';

import type { PageServerLoad } from './$types';
import { yaml_parser } from '$lib/parsers/yaml-parser';
import { does_file_exist } from '$translator/src/lib';

export const load: PageServerLoad = async ({ url }) => {
	// const { dir, lang, file } = params;
	const file_path = `${url.searchParams.get('file')}`;
	const lang = url.searchParams.get('lang');
	const format = url.searchParams.get('format');

	// console.log({ file_path, lang, format });

	if (!lang || !format || !file_path) {
		error(400, {
			message: `Missing parameters`
		});
	}

	const source_path = `${config.root_dir}${file_path}`;
	const target_path = `${source_path.replace(/\/en\//, `/${lang}/`)}`;

	const source_doc = await fs.readFile(source_path, 'utf8');

	const has_target_doc = await does_file_exist(`${target_path}`);

	let target_doc: string | null = null;

	if (has_target_doc) {
		target_doc = await fs.readFile(target_path, 'utf8');
	}

	let source_mdx;
	let source_yaml;

	let target_mdx;
	let target_yaml;

	let source;

	if (format === 'mdx') {
		source_mdx = mdx_parser(source_path);
		target_mdx = has_target_doc ? mdx_parser(target_path) : null;
	} else {
		source_yaml = await yaml_parser(source_path);
		target_yaml = has_target_doc ? await yaml_parser(target_path) : null;
	}

	const { content: source_content, data: source_data } = matter(source_doc);

	console.log('target', has_target_doc);

	const does_t5_exist = does_file_exist(config.root_dir + 't5.json');

	if (!does_t5_exist) {
		await fs.writeFile(config.root_dir + 't5.json', JSON.stringify([]), 'utf8');
	}

	const t5 = JSON.parse(await fs.readFile(config.root_dir + 't5.json', 'utf8'));

	const status =
		((await does_t5_exist) && t5.find((item: T5Item) => item.file_path === target_path)?.status) ||
		'pending';

	const target = has_target_doc ? matter(target_doc || '') : null;

	let target_content = null;
	let target_data = null;

	if (has_target_doc) {
		target_content = await fs.readFile(target_path, 'utf8');
	} else {
		console.log('No target doc');
	}

	return {
		status,
		source: {
			data: source_data,
			content: format === 'mdx' ? source_mdx?.content : source_content,
			frontmatter: format === 'mdx' ? source_mdx?.frontmatter : source_yaml,
			path: source_path
			// mdx: source_mdx,
			// yaml: source_yaml
			// blocks: source_blocks
		},
		target_exists: has_target_doc,
		target: {
			data: target?.data,
			content: format === 'mdx' ? target_mdx?.content : target_content,
			frontmatter: format === 'mdx' ? target_mdx?.frontmatter : target_yaml,
			path: target_path
			// blocks: target_blocks
		}
	};
};
