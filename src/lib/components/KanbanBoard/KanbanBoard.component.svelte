<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import Column from './Column.component.svelte';
	import Icon from '@iconify/svelte';
	import { kanbanStore } from '$lib/store';
	import type { KanbanBoardData } from '$types/kanban';

	let kanbanData: KanbanBoardData;

	kanbanStore.subscribe((store) => {
		kanbanData = store.kanbanBoard;
	});
</script>

<section class="wrapper flex w-screen p-4">
	<div class="flex flex-1 rounded-3xl bg-gray-200">
		{#each Object.entries(kanbanData) as [columnId, entry]}
			<Column title={entry.columnName} tasks={entry.tasks} {columnId} />
		{/each}

		<!--  -->
		<div class="add-new-board-col p-4">
			<Button class="w-full flex items-center justify-between" color="purple" outline={true}>
				Add Another List
				<Icon icon="typcn:plus" />
			</Button>
		</div>
	</div>
</section>

<style lang="scss">
	.wrapper {
		min-height: calc(100vh - 9rem);
		overflow-x: auto;
	}
	.add-new-board-col {
		min-width: 300px;
	}
</style>
