import fs from 'node:fs/promises';

// export function parseBlocks(content) {
// 	const blocks = [];
// 	const lines = content.split('\n');
// 	let currentBlock = '';
// 	let isInCodeBlock = false;

// 	// Iterate through each line
// 	for (const line of lines) {
// 		if (line.startsWith('---')) {
// 			// Front matter
// 			if (currentBlock.trim() !== '') {
// 				blocks.push({ type: 'content', value: currentBlock.trim() });
// 				currentBlock = '';
// 			}
// 			blocks.push({ type: 'frontmatter', value: line });
// 		} else if (line.startsWith('{/*')) {
// 			// Component or Comment
// 			if (currentBlock.trim() !== '') {
// 				blocks.push({ type: 'content', value: currentBlock.trim() });
// 				currentBlock = '';
// 			}
// 			blocks.push({ type: line.includes('import') ? 'component' : 'comment', value: line });
// 		} else if (line.startsWith('```')) {
// 			// Code block
// 			if (currentBlock.trim() !== '') {
// 				blocks.push({ type: 'content', value: currentBlock.trim() });
// 				currentBlock = '';
// 			}
// 			if (isInCodeBlock) {
// 				isInCodeBlock = false;
// 				blocks.push({ type: 'code', value: line });
// 			} else {
// 				isInCodeBlock = true;
// 				blocks.push({ type: 'code-start', value: line });
// 			}
// 		} else {
// 			// Regular text or headings
// 			if (currentBlock.trim() === '' && line.trim().startsWith('#')) {
// 				blocks.push({ type: 'heading', value: line });
// 			} else {
// 				currentBlock += line + '\n';
// 			}
// 		}
// 	}

// 	// Push the last block
// 	if (currentBlock.trim() !== '') {
// 		blocks.push({ type: 'content', value: currentBlock.trim() });
// 	}

// 	return blocks;
// }

export async function does_file_exist(path: string) {
	try {
		await fs.access(path);
		return true;
	} catch (err) {
		return false;
	}
}
