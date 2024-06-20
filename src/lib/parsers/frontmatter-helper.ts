interface KeyValue {
	key: string;
	value: any;
}

function isObject(value: any): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null; // Improved isObject check
}

export function flattenFrontmatter(obj: Record<string, any>, prefix = ''): KeyValue[] {
	const result: KeyValue[] = [];
	for (const key in obj) {
		if (isObject(obj[key])) {
			result.push(...flattenFrontmatter(obj[key], `${prefix}${key}.`)); // Use spread operator for concatenation
		} else {
			result.push({ key: `${prefix}${key}`, value: obj[key] });
		}
	}
	return result;
}

export function unflattenFrontmatter(flattenedData: KeyValue[]): Record<string, any> {
	const result: Record<string, any> = {};
	for (const item of flattenedData) {
		const keyParts = item.key.split('.');
		let currentDict = result;
		for (let i = 0; i < keyParts.length - 1; i++) {
			const part = keyParts[i];
			if (!currentDict[part]) {
				currentDict[part] = {};
			}
			currentDict = currentDict[part];
		}
		currentDict[keyParts[keyParts.length - 1]] = item.value;
	}
	return result;
}
