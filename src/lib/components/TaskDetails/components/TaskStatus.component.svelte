<script lang="ts">
	import { updateTaskStatus } from '$lib/api/appwrite/tasks.api';
	import { kanbanStore } from '$lib/store';
	import boardStore from '$lib/store/boards.store';
	import type { Board } from '$lib/types/board';
	import type { Task, TaskStatus } from '$types/kanban';
	import { Select } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	export let taskDetails: Task;
	let taskId: string = taskDetails.id;
	let status: TaskStatus = taskDetails.status;

	let currentBoard: Board;

	const unsubFromBoardStore = boardStore.subscribe((store) => {
		currentBoard = store.currentBoard as Board;
	});

	let items: { name: string; value: string }[];
	const unsub = kanbanStore.subscribe((store) => {
		items = Object.keys(store.kanbanBoard).map((colKey) => ({
			name: store.kanbanBoard[colKey].columnName,
			value: colKey,
		}));
	});

	onDestroy(() => {
		unsub();
		unsubFromBoardStore();
	});

	const hanldeChange = async (e: Event): Promise<void> => {
		const target = e.target as HTMLSelectElement;
		await updateTaskStatus(taskId, target.value, status.id, currentBoard.id);
	};
</script>

<div class="flex items-center gap-x-4">
	<span>In Status: </span>
	<div class="w-40">
		<Select underline size="sm" {items} value={status.id} on:change={hanldeChange} />
	</div>
</div>
