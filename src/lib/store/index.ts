import { writable } from 'svelte/store';

export const target_changed_store = writable(false);
export const target_content_store = writable({
	frontmatter: null,
	content: ''
});

export let selected_status = writable('');
