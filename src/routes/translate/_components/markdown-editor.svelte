<script lang="ts">
	import autosize from 'svelte-autosize';
	import toast, { Toaster } from 'svelte-french-toast';
	import { page } from '$app/stores';

	import { marked } from 'marked';

	import 'carta-md/default.css'; /* Default theme */
	import '@cartamd/plugin-code/default.css';
	import '@cartamd/plugin-emoji/default.css';

	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import { ScrollArea } from '$lib/components/ui/scroll-area/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import ConfigEditor from './config-editor.svelte';
	import ConfirmAlert from './confirm-alert.svelte';

	import { target_changed_store, target_content_store } from '$translator/src/lib/store';

	export let source: any;
	export let target: any;

	export let handleSave;

	const lang = $page.url.searchParams.get('lang');
	const format = $page.url.searchParams.get('format');

	const target_path = target.exists ? target.path : source.path.replace(/\/en\//, `/${lang}/`);

	let target_content = target.exists ? target.content.trim() : source.content;

	// const carta = new Carta({
	// 	sanitizer: DOMPurify.sanitize,
	// 	extensions: [code(), emoji()]
	// });

	$target_content_store.content = target_content;

	$: {
		if (target_content !== $target_content_store.content) {
			$target_changed_store = true;
		} else {
			$target_changed_store = false;
		}
	}

	// Dialog

	let open_dialog = false;

	let has_frontmatter = !(
		Object.keys(source.frontmatter).length === 0 && source.frontmatter.constructor === Object
	);

	function handleInput() {
		$target_changed_store = true;
	}
</script>

{#if $target_changed_store}
	<div class="fixed bottom-4 right-4 z-20">
		<ConfirmAlert {handleSave} {format} {target_path} target_content={$target_content_store}>
			<Button>Save</Button>
		</ConfirmAlert>
	</div>
{/if}

{#if has_frontmatter}
	<div class="rounded-xl border-2 bg-gray-100 p-4">
		<Dialog.Root bind:open={open_dialog}>
			<Dialog.Trigger>
				<Button>Edit Frontmatter</Button>
			</Dialog.Trigger>
			<Dialog.Overlay />
			<Dialog.Content class="max-w-4xl ">
				<Dialog.Header>
					<Dialog.Title>Frontmatter</Dialog.Title>
				</Dialog.Header>
				<Dialog.Description>
					<ScrollArea class="h-[80vh] p-8">
						<ConfigEditor {handleSave} {source} {target} />
					</ScrollArea>
				</Dialog.Description>
				<Dialog.Footer>
					<Button variant="default">Update</Button>
					<Button on:click={() => (open_dialog = false)} variant="outline">Cancel</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
{/if}

<!-- CARTA -->
<!-- <div class="grid grid-cols-2 gap-4 p-4">
	<div id="editor">
		<ScrollArea class="h-[80vh] rounded-xl bg-gray-100 p-2">
			<Markdown {carta} bind:value={source.content} />
		</ScrollArea>
	</div>
	<div id="editor">
		<MarkdownEditor {carta} mode="tabs" bind:value={target_content} />
	</div>
</div> -->

<!-- MARKED -->
<div class="grid grid-cols-2 gap-4 p-4">
	<div id="editor">
		<!-- <ScrollArea class="h-[80vh] rounded-xl bg-gray-100 p-2"> -->
		<Tabs.Root value="markdown" class="w-full rounded-lg border-2 p-2">
			<Tabs.List>
				<Tabs.Trigger value="markdown">Markdown</Tabs.Trigger>
				<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="markdown"
				><pre
					class="cursor-not-allowed text-wrap rounded-lg border-2 bg-gray-100 p-2 dark:bg-gray-700">{source.content.trim()}</pre></Tabs.Content
			>
			<Tabs.Content value="preview"><p>{@html marked(source.content.trim())}</p></Tabs.Content>
		</Tabs.Root>

		<!-- </ScrollArea> -->
	</div>
	<div id="editor">
		<Tabs.Root value="editor" class="w-full rounded-lg border-2 p-2">
			<Tabs.List>
				<Tabs.Trigger value="editor">Editor</Tabs.Trigger>
				<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="editor"
				><textarea
					on:input={handleInput}
					class="w-full"
					bind:value={$target_content_store.content}
					use:autosize
				/></Tabs.Content
			>
			<Tabs.Content value="preview"
				><p>{@html marked($target_content_store.content.trim())}</p></Tabs.Content
			>
		</Tabs.Root>
		<Toaster />
	</div>
</div>

<style>
	textarea {
		padding: 0.5rem;
	}
</style>
