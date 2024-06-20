export function to_snake_case(obj: Record<string, any>): Record<string, any> {
	const snakeCaseObj: Record<string, any> = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const snakeCaseKey = key.replace(/-/g, '_');
			snakeCaseObj[snakeCaseKey] = obj[key];
		}
	}
	return snakeCaseObj;
}
