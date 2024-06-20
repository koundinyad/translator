<!-- <section class="col-span-2 overflow-x-hidden">
	<ScrollArea class="h-[80vh]">
		<Table.Root class="overflow-x-hidden rounded-xl ">
			<Table.Header>
				<Table.Row>
					<Table.Head class="text-2xl">{selected_dir.directory}</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each selected_dir.en_subdirs as sub_dir}
					<Table.Row>
						<Table.Cell class="flex gap-2">
							<a href={`/${selected_dir.directory}/es/${sub_dir.name}/translate`}>
								{#if sub_dir.type == 'directory'}
									<Folder />
								{:else}
									<FileText />
								{/if}
								{sub_dir.name}</a
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</ScrollArea>
</section> -->
