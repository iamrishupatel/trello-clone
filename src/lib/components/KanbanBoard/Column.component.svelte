<script lang="ts">
	import Card from '$components/common/Card/Card.component.svelte';
	import { updateTaskStatus } from '$lib/api/appwrite/tasks.api';
	import { kanbanStore } from '$lib/store';
	import type { KanbanBoardData, KanbanStore, Task } from '$types/kanban';
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';
	import NewTask from '../NewTask/NewTask.component.svelte';
	import TaskDetails from '$components/TaskDetails/TaskDetails.component.svelte';
	import type { Board } from '$lib/types/board';
	import boardStore from '$lib/store/boards.store';
	import { Badge } from 'flowbite-svelte';
	import classNames from 'classnames';

	export let title = '',
		tasks: Task[] = [],
		columnId: string;

	let kanbanData: KanbanBoardData;
	let showTaskModal = false;
	let selectedTask: Task | null = null;
	let currentBoard: Board;
	let isCurrentColumnHighlighted = false;

	const unsubFromBoardStore = boardStore.subscribe((store) => {
		currentBoard = store.currentBoard as Board;
	});

	const handleDrawerOpen = (task: Task): void => {
		showTaskModal = true;
		selectedTask = task;
	};

	const unsub = kanbanStore.subscribe((store) => (kanbanData = store.kanbanBoard));

	onDestroy(() => {
		unsub();
		unsubFromBoardStore();
	});

	async function handleDrop(event: any): Promise<void> {
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

		/**
		 * FIXME::
		 * update the task status in the DB
		 * in case the update fails,
		 * sync the local store that is updated above
		 * and display the error message
		 */
		isCurrentColumnHighlighted = false;
		await updateTaskStatus(currentCard.id, destinationColumnId, sourceColumnId, currentBoard.id);
	}

	function allowDrop(event: any): void {
		isCurrentColumnHighlighted = true;
		event.preventDefault();
	}

	const hanldeDragStart = (event: any): void => {
		event.dataTransfer.setData('cardId', event.target.id);
		event.dataTransfer.setData('sourceColumnId', columnId);
		isCurrentColumnHighlighted = true;
	};

	const hanldeDragEnd = (): void => {
		isCurrentColumnHighlighted = false;
	};

	const highlightCurrentColumn = (): void => {
		isCurrentColumnHighlighted = true;
	};

	const unHighlightCurrentColumn = (): void => {
		isCurrentColumnHighlighted = false;
	};
</script>

<section
	class={classNames({
		'border-2 border-slate-300 rounded-lg bg-slate-200': true,
		'border-2 border-primary-600': isCurrentColumnHighlighted,
	})}
	on:drop={handleDrop}
	on:dragover={allowDrop}
	on:dragenter={highlightCurrentColumn}
	on:dragleave={unHighlightCurrentColumn}
>
	<div class="flex items-center justify-between h-12 p-4">
		<p class="capitalize">
			{title}

			<Badge rounded color="dark">{tasks.length}</Badge>
		</p>
	</div>

	<div class="column overflow-y-auto w-full flex flex-1 flex-col items-center gap-y-6 p-2 px-4">
		{#each tasks as task}
			<div
				id={task.id}
				draggable="true"
				class="w-full rounded-lg"
				on:dragstart={hanldeDragStart}
				on:dragend={hanldeDragEnd}
			>
				<Card
					cardTitle={task.title}
					labels={task.labels}
					priority={task.priority}
					users={task.assignees}
					thumbnailURL={task.coverUrl}
					draggable={true}
					on:click={//
					// eslint-disable-next-line
					() => {
						handleDrawerOpen(task);
					}}
					href="#"
				/>
			</div>
		{/each}
	</div>

	<div class="py-2 px-4">
		<NewTask
			defaultStatusId={columnId}
			btnClass="w-full flex items-center justify-between"
			color="dark"
			outline={true}
		>
			<div class="flex items-center">
				<Icon icon="material-symbols:add" />
				<span class="ml-2">Add another card</span>
			</div>
		</NewTask>
	</div>

	<TaskDetails bind:isModalOpen={showTaskModal} taskDetails={selectedTask} />
</section>

<style lang="scss">
	.column {
		height: calc(100vh - 16rem);
		@media screen and (max-width: 1400px) {
			width: 350px;
		}
		@media screen and (min-width: 1400px) {
			width: 400px;
		}

		&::-webkit-scrollbar {
			width: 10px;
		}

		&::-webkit-scrollbar,
		&::-webkit-scrollbar-thumb {
			width: 6px;
			// border-radius: 13px;
			background-clip: padding-box;
		}

		&::-webkit-scrollbar-thumb {
			box-shadow: inset 0 0 0 10px;
		}
	}
</style>
