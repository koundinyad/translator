<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import autosize from 'svelte-autosize';
	import toast, { Toaster } from 'svelte-french-toast';

	import { flattenFrontmatter } from '$lib/parsers/frontmatter-helper';

	import Button from '$lib/components/ui/button/button.svelte';

	import { target_changed_store } from '$lib/store';

	const format = $page.url.searchParams.get('format');
	const lang = $page.url.searchParams.get('lang');

	export let source;
	export let target;
	export let handleSave;

	interface KeyValue {
		key: string;
		value: string | number | boolean | Record<string, any>;
	}

	// console.log({ source, target });

	const target_exists = target.exists;

	const target_path = target_exists ? target.path : source.path.replace(/\/en\//, `/${lang}/`);

	let target_fm = target_exists ? target.frontmatter : source.frontmatter;

	let flattened_frontmatter: KeyValue[] = [];

	onMount(() => {
		flattened_frontmatter = flattenFrontmatter(source.frontmatter);
	});

	function handleInput() {
		$target_changed_store = true;
	}
</script>

<div class="grid grid-cols-5 gap-6 font-bold">
	<p class="col-span-1">Name</p>
	<p class="col-span-2">Original Text</p>
	<p class="col-span-2">Translated Text</p>
</div>

{#each flattened_frontmatter as { key, value } (key)}
	<div class="mt-4 grid grid-cols-5 gap-2">
		<p class="col-span-1 font-mono">{key}</p>
		<textarea
			disabled
			use:autosize
			class="col-span-2 cursor-not-allowed rounded border p-2 font-mono disabled:bg-gray-100 dark:disabled:bg-gray-600"
			bind:value
		></textarea>
		<textarea
			use:autosize
			class="col-span-2 cursor-pointer rounded border p-2 font-mono hover:border-blue-500 dark:hover:border-blue-400"
			bind:value={target_fm[key]}
			on:input={handleInput}
		></textarea>
	</div>
{/each}

<Toaster />

<!-- {#each Object.entries(source.frontmatter) as [key, value]}
	<div class="mt-4 grid grid-cols-5 gap-2">
		<p class="col-span-1">{key}</p>
		<textarea
			disabled
			use:autosize
			class="col-span-2 cursor-not-allowed rounded border p-2 disabled:bg-gray-100"
			bind:value
		></textarea>
		<textarea use:autosize class="col-span-2 cursor-pointer rounded border p-2" bind:value={y}
		></textarea>
	</div>
{/each} -->
