<script lang="ts">
	import { TASK_PRIORITIES } from '$constants/app.constans';
	import { updateTaskPriority } from '$lib/api/appwrite/tasks.api';
	import type { TaskPriority } from '$types/kanban';
	import { Select } from 'flowbite-svelte';

	export let taskId: string;
	export let priority: TaskPriority | null;

	const items = TASK_PRIORITIES.map((priority) => ({
		name: priority.text.toLocaleUpperCase(),
		value: priority.id,
	}));

	const defaultPriority = priority ? priority.id : '';

	const hanldeChange = async (e: Event): Promise<void> => {
		const target = e.target as HTMLSelectElement;
		await updateTaskPriority(taskId, target.value);
	};
</script>

<div class="flex items-center gap-x-4">
	<span>In Priority: </span>
	<div class="w-40 capitalize">
		<Select underline size="sm" {items} value={defaultPriority} on:change={hanldeChange} />
	</div>
</div>
