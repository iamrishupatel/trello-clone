<script lang="ts">
	import { TASK_PRIORITIES } from '$constants/app.constans';
	import { updateTaskPriority } from '$lib/api/appwrite/tasks.api';
	import boardStore from '$lib/store/boards.store';
	import type { Board } from '$lib/types/board';
	import type { Task } from '$types/kanban';
	import { Select } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	export let taskDetails: Task;

	let priority = taskDetails.priority;

	let currentBoard: Board;
	const unsub = boardStore.subscribe((store) => {
		currentBoard = store.currentBoard as Board;
	});

	onDestroy(unsub);

	const items = TASK_PRIORITIES.map((priority) => ({
		name: priority.text.toLocaleUpperCase(),
		value: priority.id,
	}));

	const defaultPriority = priority ? priority.id : '';

	const hanldeChange = async (e: Event): Promise<void> => {
		const target = e.target as HTMLSelectElement;
		await updateTaskPriority(taskDetails.id, target.value, currentBoard.id, taskDetails.status.id);
	};
</script>

<div class="flex items-center gap-x-4">
	<span>In Priority: </span>
	<div class="w-40 capitalize">
		<Select underline size="sm" {items} value={defaultPriority} on:change={hanldeChange} />
	</div>
</div>
