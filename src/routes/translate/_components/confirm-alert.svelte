<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { selected_status } from '$translator/src/lib/store';

	export let handleSave;
	export let format;
	export let target_path;
	export let target_content;

	let statuses = ['pending', 'completed', 'partial'];
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger><slot /></AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Save Files?</AlertDialog.Title>
			<AlertDialog.Description>
				<RadioGroup.Root value={statuses[0]}>
					{#each statuses as status}
						<div class="flex items-center space-x-2">
							<RadioGroup.Item
								on:click={() => ($selected_status = status)}
								value={status}
								id={status}
							/>
							<Label for={status}>{status}</Label>
						</div>
					{/each}
				</RadioGroup.Root>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="bg-green-600"
				on:click={() => handleSave({ format, target_path, target_content })}
				>Confirm Save</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
