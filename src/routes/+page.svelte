<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	import { Folder, FolderOpen, FileText } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index';
	import Spinner from '$lib/components/spinner.svelte';

	import Combobox from './_components/lang-combobox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;

	const { directories, page_data } = data;

	let show_subdirs = false;

	let selected_dir: BaseData = { dir_name: '', en_subdirs: [], languages: [] };

	let has_params = writable(false);

	$: query = browser && new URLSearchParams($page.url.searchParams);
	$: $has_params = page_data?.search_params.q ? true : false || $page.url.searchParams.has('q');

	$: selected_dir =
		directories?.find((d) => d.dir_name === ($page.url.searchParams.get('q') ?? '') || '') ||
		selected_dir;

	$: selected_dir.dir_name = selected_dir.dir_name ?? '';

	function updateQueryParams(dir: string) {
		if (query instanceof URLSearchParams) {
			query.set('q', dir);
		}
		const q = query instanceof URLSearchParams ? query.get('q') : null;
		goto(`/?q=${q ? q.toString() : ''}`);
	}

	const handleSearch = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
	};
</script>

<section class="mt-4 grid h-min grid-cols-3 gap-8">
	<section class="col-span-1">
		<Table.Root class="border-separate">
			<Table.Header>
				<Table.Row>
					<Table.Head>Content</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each directories || [] as dir}
					<Table.Row>
						<Table.Cell
							class={`rounded-xl ${dir.dir_name == selected_dir.dir_name ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
							on:click={() => {
								updateQueryParams(dir.dir_name ?? '');
							}}
						>
							<Button
								class={`flex gap-2 rounded-lg outline-0 hover:cursor-pointer `}
								variant="link"
							>
								{#if dir.dir_name == selected_dir.dir_name && show_subdirs}
									<FolderOpen />
								{:else}
									<Folder />{/if}{dir.dir_name}
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>

	<section class="col-span-2 overflow-x-hidden">
		{#if $has_params}
			{#if $navigating}
				<Spinner />
			{:else}
				<ScrollArea class="h-[80vh]">
					<!-- <Input
						placeholder="Search"
						class="sticky top-0 w-fit p-4 focus:border-2 focus:border-blue-500"
						on:input={handleSearch}
					/> -->
					<Table.Root class="overflow-x-hidden rounded-xl ">
						<Table.Header>
							<Table.Row>
								<Table.Head class="text-2xl">{selected_dir.dir_name}</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each selected_dir.en_subdirs as sub_dir}
								<Table.Row>
									<Table.Cell class="flex gap-2">
										<Combobox
											path={`/translate/?file=${sub_dir.paths.formatted}&format=${sub_dir.format}`}
											langs={selected_dir.languages}
											status={sub_dir.status}
										>
											<button class="flex gap-2">
												<FileText />
												{sub_dir.title.replace(`${query ? query.get('q') : ''}/`, '')}</button
											>
										</Combobox>
										<Badge>{sub_dir.format === 'mdx' ? 'docs' : 'UI'}</Badge>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</ScrollArea>
			{/if}
		{/if}
	</section>
</section>
