<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { updateTaskTitle } from '$lib/api/appwrite/tasks.api';
	import type { Board } from '$lib/types/board';
	import boardStore from '$lib/store/boards.store';
	import type { Task } from '$lib/types/kanban';
	import { Button, Helper, Input, Spinner } from 'flowbite-svelte';
	import { Status } from '$lib/enums/Status.enums';
	import type { AppwriteApiError } from '$lib/types/error.types';

	export let taskDetails: Task;

	const taskId = taskDetails.id,
		title = taskDetails.title;

	let taskTitleChangeStatus = Status.IDLE;
	let updateError = '';

	let currentBoard: Board;
	const unsub = boardStore.subscribe((store) => {
		currentBoard = store.currentBoard as Board;
	});

	onDestroy(unsub);

	let isEditing = false;
	let taskInputTitle = title;

	const openEditor = (): void => {
		isEditing = true;
		tick().then(() => {
			let inpEl = document.getElementById(`inp-${taskId}`) as HTMLInputElement;
			inpEl.focus();
		});
	};

	const closeEditor = (): void => {
		isEditing = false;
		taskInputTitle = taskDetails.title;
	};

	const hanldeSave = async (): Promise<void> => {
		if (!taskInputTitle.trim()) {
			updateError = 'Title is required';
			taskTitleChangeStatus = Status.ERROR;
			return;
		}
		try {
			taskTitleChangeStatus = Status.LOADING;
			await updateTaskTitle(taskId, taskInputTitle, currentBoard.id, taskDetails.status.id);
			taskTitleChangeStatus = Status.DONE;
			isEditing = false;

			// update the store
		} catch (e) {
			const err = e as AppwriteApiError;
			updateError = err.message;
			taskTitleChangeStatus = Status.ERROR;
		}
	};

	const handleKeydown = (e: KeyboardEvent): void => {
		if (e.code === 'Enter') {
			hanldeSave();
		}
	};
</script>

<div class="inline-flex justify-between gap-x-2">
	{#if isEditing}
		<div class="w-full">
			<Input
				class="text-2xl font-bold leading-5 p-2 h-10 w-full mb-2"
				id={`inp-${taskId}`}
				bind:value={taskInputTitle}
				autocomplete="off"
				on:keydown={handleKeydown}
				placeholder="Enter a title"
			/>
			{#if updateError && taskTitleChangeStatus === Status.ERROR}
				<Helper color="red"><span class="font-medium">{updateError}</span></Helper>
			{/if}
		</div>
		<div class="flex align-baseline h-fit gap-x-2">
			<Button
				color="green"
				type="button"
				size="sm"
				on:click={hanldeSave}
				disabled={taskTitleChangeStatus === Status.LOADING}
			>
				{#if taskTitleChangeStatus === Status.LOADING}
					<Spinner class="mr-3" size="4" color="white" />Saving...
				{:else}
					Save
				{/if}
			</Button>
			<Button
				color="light"
				type="button"
				size="xs"
				on:click={closeEditor}
				disabled={taskTitleChangeStatus === Status.LOADING}>Cancel</Button
			>
		</div>
	{:else}
		<div class="flex items-center justify-between gap-x-2 w-full">
			<p id="task-title" class="text-2xl font-bold flex items-center break-all">
				{taskInputTitle}
			</p>

			<Button color="light" type="button" size="xs" on:click={openEditor}>Edit</Button>
		</div>
	{/if}
</div>
