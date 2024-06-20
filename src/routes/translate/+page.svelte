<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';

	import toast, { Toaster } from 'svelte-french-toast';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import MarkdownEditor from './_components/markdown-editor.svelte';
	import ConfigEditor from './_components/config-editor.svelte';

	import { target_content_store, target_changed_store, selected_status } from '$lib/store';

	export let data;

	const { source, target, target_exists, status } = data;

	const format = $page.url.searchParams.get('format') || '';
	const title = $page.url.searchParams.get('file')?.replace('/en', '') || '';

	// const postData = async () => {
	// 	const res = await fetch('/api/save', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: String(translated_blocks.map((block) => block.markdown).join('\n\n'))
	// 	});
	// 	const data = await res.json();
	// console.log(data);
	// };

	async function handleSave({
		format,
		target_path,
		target_content
	}: {
		format: string;
		target_path: string;
		target_content: string;
	}) {
		// console.log({ format, target_path, target_content });

		$target_changed_store = false;

		toast.promise(
			fetch('/api/save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					format: format,
					target_path: target_path,
					content: target_content,
					status: $selected_status
				})
			}),
			{
				loading: 'Saving...',
				success: 'Settings saved!',
				error: 'Could not save.'
			}
		);
	}
</script>

<header class=" flex items-center gap-8">
	<h1 class="w-fit p-2 font-mono text-3xl font-bold">{title}</h1>
	{#if status == 'pending'}
		<Badge class="bg-red-700">Pending</Badge>
	{:else if status == 'completed'}
		<Badge class="bg-green-500">Completed</Badge>
	{:else if status == 'partial'}
		<Badge class="bg-orange-500">Partial</Badge>
	{/if}
</header>

<section class="mb-16">
	{#if format === 'mdx'}
		<MarkdownEditor {handleSave} {source} target={{ ...target, exists: target_exists }} />
	{:else}
		<div class="sticky top-0 my-4 flex justify-end rounded bg-black p-2 text-white">
			<div class="mx-8 p-4">
				<Button
					on:click={() =>
						handleSave({
							format,
							target_path: target.path,
							target_content: $target_content_store.content
						})}
					class="bg-green-400 text-white disabled:cursor-not-allowed"
					disabled={!$target_changed_store}>Save</Button
				>
			</div>
		</div>

		<ConfigEditor {handleSave} {source} target={{ ...target, exists: target_exists }} />
	{/if}
</section>
