import fs from 'fs';
import matter from 'gray-matter';
import { to_snake_case } from './helpers/casing';

interface ParsedMDX {
	frontmatter: Record<string, any>;
	content: string;
}

export default function mdx_parser(file_path: string): ParsedMDX {
	const file_content: string = fs.readFileSync(file_path, 'utf-8');
	const { content, data: frontmatter } = matter(file_content);

	const converted_frontmatter = to_snake_case(frontmatter);

	return {
		frontmatter: converted_frontmatter,
		content
	};
}

// export default function mdx_parser(file_path: string): ParsedMDX {
// 	const file_content: string = fs.readFileSync(file_path, 'utf-8');
// 	const { content, data: frontmatter } = matter(file_content);

// 	const converted_frontmatter = to_snake_case(frontmatter);

// 	// Regular expression to match markdown image syntax
// 	const imageRegex = /!\[.*?\]\((.*?)\)/g;

// 	// Replace image URLs with prefixed URLs
// 	const modifiedContent = content.replace(imageRegex, (match, imageUrl) => {
// 		const prefixedUrl = `${config.root_dir.replace(/\/$/, '')}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
// 		return `![${imageUrl}](${prefixedUrl})`;
// 	});

// 	return {
// 		frontmatter: converted_frontmatter,
// 		content: modifiedContent
// 	};
// }
