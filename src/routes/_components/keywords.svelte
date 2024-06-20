<script lang="ts">
	import { onMount } from 'svelte';
	import { readable } from 'svelte/store';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addTableFilter } from 'svelte-headless-table/plugins';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';

	type Keywords = {
		source: string;
		target: string;
		notes: string | null;
	};
	export let keywords: Keywords[];

	const table = createTable(readable(keywords), {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'source',
			header: 'Source'
		}),
		table.column({
			accessor: 'target',
			header: 'Target'
		}),
		table.column({
			accessor: (d) => d.notes ?? '',
			header: 'Notes',
			plugins: {
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { filterValue } = pluginStates.filter;
</script>

<div class="flex items-center py-4">
	<Input class="max-w-sm" placeholder="Search" type="text" bind:value={$filterValue} />
</div>
<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
