<script lang="ts">
	import { updateTaskStatus } from '$lib/api/appwrite/tasks.api';
	import { kanbanStore } from '$lib/store';
	import type { TaskStatus } from '$types/kanban';
	import { Select } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	export let taskId: string;
	export let status: TaskStatus;

	let items: { name: string; value: string }[];
	const unsub = kanbanStore.subscribe((store) => {
		items = Object.keys(store.kanbanBoard).map((colKey) => ({
			name: store.kanbanBoard[colKey].columnName,
			value: colKey,
		}));
	});

	onDestroy(unsub);

	const hanldeChange = async (e: Event): Promise<void> => {
		const target = e.target as HTMLSelectElement;
		await updateTaskStatus(taskId, target.value, status.id);
	};
</script>

<div class="flex items-center gap-x-4">
	<span>In Status: </span>
	<div class="w-40">
		<Select underline size="sm" {items} value={status.id} on:change={hanldeChange} />
	</div>
</div>
