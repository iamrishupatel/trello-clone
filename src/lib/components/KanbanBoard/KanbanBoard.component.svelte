<script lang="ts">
	import Column from './Column.component.svelte';
	import { kanbanStore } from '$lib/store';
	import type { KanbanBoardData } from '$types/kanban';
	import { onDestroy } from 'svelte';

	let kanbanData: KanbanBoardData;

	const unsub = kanbanStore.subscribe((store) => {
		kanbanData = store.kanbanBoard;
	});

	onDestroy(unsub);
</script>

{#if kanbanData}
	<section class="wrapper flex flex-1 w-screen">
		<div class="flex gap-2 ml-10 flex-1 rounded-lg">
			{#each Object.entries(kanbanData) as [columnId, entry]}
				<Column title={entry.columnName} tasks={entry.tasks} {columnId} />
			{/each}
		</div>
	</section>
{/if}

<style lang="scss">
	.wrapper {
		height: calc(100vh - 9rem);
		overflow-x: auto;
	}
</style>
