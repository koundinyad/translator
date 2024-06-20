<script lang="ts">
	import { goto } from '$app/navigation';

	import ISO6391 from 'iso-639-1';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Command from '$lib/components/ui/command/index.js';
	import Badge from '$translator/src/lib/components/ui/badge/badge.svelte';

	export let path: string;
	export let langs: string[];
	export let status: string;

	const handle_select = (lang: string) => {
		goto(`${path}&lang=${lang}`);
	};
</script>

<Dialog.Root>
	<Dialog.Trigger><slot /></Dialog.Trigger>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Select Target Language</Dialog.Title>
		</Dialog.Header>
		<form on:submit|preventDefault class="space-y-6">
			<Command.Root>
				<Command.Input autofocus placeholder="Search language..." class="h-9" />
				<Command.Empty>No language found.</Command.Empty>
				<Command.Group>
					{#each langs as lang}
						<Command.Item
							class="flex justify-between"
							value={ISO6391.getName(lang)}
							onSelect={() => {
								handle_select(lang);
							}}
						>
							{ISO6391.getName(lang)} ({lang})
							{#if status == 'pending'}
								<Badge variant="destructive">Pending</Badge>
							{:else if status == 'completed'}
								<Badge class="bg-green-500">Completed</Badge>
							{:else if status == 'partial'}
								<Badge class="bg-orange-500">Partial</Badge>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</form>
	</Dialog.Content>
</Dialog.Root>
