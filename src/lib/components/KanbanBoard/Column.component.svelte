<script lang="ts">
	import Card from '$components/common/Card/Card.component.svelte';
	import { kanbanStore } from '$lib/store';
	import type { KanbanBoardData, KanbanStore, Task } from '$types/kanban';
	import Icon from '@iconify/svelte';
	import { Button } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	export let title = '';
	export let tasks: Task[] = [];
	export let columnId: string;

	let kanbanData: KanbanBoardData;
	const un = kanbanStore.subscribe((store) => (kanbanData = store.kanbanBoard));
	onDestroy(un);

	function handleDrop(event: any): void {
		event.preventDefault();
		let destinationColumnId = columnId;
		if (!kanbanData) {
			return;
		}

		const cardId = event.dataTransfer.getData('cardId');
		const sourceColumnId = event.dataTransfer.getData('sourceColumnId');

		if (sourceColumnId === destinationColumnId) {
			return;
		}

		const currentCard = kanbanData[sourceColumnId].tasks.find((task) => task.id === cardId);

		if (!currentCard) {
			return;
		}

		// add the current card to destination column
		// remove the current card from source column
		kanbanStore.update((kStore): KanbanStore => {
			const updatedData: KanbanBoardData = {
				...kStore.kanbanBoard,
			};

			updatedData[destinationColumnId].tasks.push(currentCard);
			updatedData[sourceColumnId].tasks = kStore.kanbanBoard[sourceColumnId].tasks.filter(
				(task) => task.id !== currentCard.id,
			);

			return {
				...kStore,
				kanbanBoard: updatedData,
			};
		});
	}

	function allowDrop(event: any): void {
		event.preventDefault();
	}

	const hanldeDragStart = (event: any): void => {
		event.dataTransfer.setData('cardId', event.target.id);
		event.dataTransfer.setData('sourceColumnId', columnId);
	};
</script>

<section class="column overflow-y-auto p-4" on:drop={handleDrop} on:dragover={allowDrop}>
	<div class="flex items-center justify-between p-4">
		<p class="capitalize">{title}</p>

		<Icon icon="tabler:dots" />
	</div>

	<div class="flex flex-col items-center gap-y-6">
		{#each tasks as task}
			<div id={task.id} draggable="true" on:dragstart={hanldeDragStart}>
				<Card
					cardTitle={task.title}
					labels={task.labels}
					users={task.assignees}
					thumbnailURL={task.coverUrl}
					draggable={true}
				/>
			</div>
		{/each}

		<Button class="w-[20rem] flex items-center justify-between" color="purple" outline={true}>
			Add Another Card
			<Icon icon="typcn:plus" />
		</Button>
	</div>
</section>

<style lang="scss">
	.column {
		min-width: 400px;
		padding-bottom: 2rem;

		&::-webkit-scrollbar {
			width: 10px;
		}

		&::-webkit-scrollbar,
		&::-webkit-scrollbar-thumb {
			width: 26px;
			border-radius: 13px;
			background-clip: padding-box;
			border: 10px solid transparent;
		}

		&::-webkit-scrollbar-thumb {
			box-shadow: inset 0 0 0 10px;
		}
	}
</style>