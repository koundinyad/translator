type BaseData = {
	dir_name: string;
	en_subdirs: EnFiles[];
	languages: string[];
};

type EnFiles = {
	filename: string;
	path: string;
	format: string;
	full_path: string;
	title: string;
	paths: {
		absolute: string;
		formatted: string;
	};
	status: string;
};

type T5Item = {
	file_path: string;
	file_type: string;
	status: string;
	last_updated: string;
};
