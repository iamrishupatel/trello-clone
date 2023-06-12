<script lang="ts">
	import { Badge, Button, Dropzone, Modal, Spinner } from 'flowbite-svelte';
	import type { Task } from '$types/kanban';
	import TaskTitle from './components/TaskTitle.component.svelte';
	import TaskStatus from './components/TaskStatus.component.svelte';
	import TaskDescription from './components/TaskDescription.component.svelte';
	import TaskPriority from './components/TaskPriority.component.svelte';
	import SelectLabel from '$components/NewTask/SelectLabel.component.svelte';
	import {
		addLabelInTask,
		removeLabelInTask,
		updateTaskCoverUrl,
	} from '$lib/api/appwrite/tasks.api';
	import type { CardLabel } from '$types/card';
	import Icon from '@iconify/svelte';
	import CoverUploader from './components/CoverUploader.component.svelte';
	import { Status } from '$enums/Status.enums';
	import toast from 'svelte-french-toast';
	import TaskActivity from './components/TaskActivity.component.svelte';
	import { onDestroy } from 'svelte';
	import type { Board } from '$lib/types/board';
	import boardStore from '$lib/store/boards.store';
	import { kanbanStore } from '$lib/store';

	export let taskDetails: Task | null,
		isModalOpen = false;

	const unsubscribe = kanbanStore.subscribe((store) => {
		store.kanbanBoard;

		// Iterate over each column in the kanban board
		for (const columnId in store.kanbanBoard) {
			const columnData = store.kanbanBoard[columnId];
			const { tasks } = columnData;

			// Iterate over the tasks in the current column
			for (const task of tasks) {
				if (task.id === taskDetails?.id) {
					taskDetails = task;
				}
			}
		}
	});

	onDestroy(unsubscribe);

	let currentBoard: Board;
	const unsub = boardStore.subscribe((store) => {
		currentBoard = store.currentBoard as Board;
	});

	onDestroy(unsub);

	const hanldeAddLabel = async (e: CustomEvent): Promise<void> => {
		if (!taskDetails) return;
		const newLabel = e.detail as CardLabel;
		await addLabelInTask(
			taskDetails.id,
			newLabel.id,
			taskDetails.labels,
			currentBoard.id,
			taskDetails.status.id,
		);
	};
	const hanldeRemoveLabel = async (e: MouseEvent): Promise<void> => {
		if (!taskDetails) return;

		const removedLabelId = (e.currentTarget as HTMLButtonElement).id;
		await removeLabelInTask(
			taskDetails?.id,
			removedLabelId,
			taskDetails.labels,
			currentBoard.id,
			taskDetails.status.id,
		);
	};

	// file uploads

	let imageSrc = taskDetails?.coverUrl;
	let imageFile: File | string | null;
	let coverUplaodStatus = Status.IDLE;

	$: {
		if (imageFile) {
			imageSrc = typeof imageFile === 'string' ? imageFile : URL.createObjectURL(imageFile);
		} else {
			imageSrc = taskDetails?.coverUrl;
		}
	}

	const handleFileChange = (e: Event): void => {
		const target = e.target as HTMLInputElement;
		if (target.files === null || target.files?.length === 0) return;

		const file = target?.files[0];

		if (file) {
			imageFile = file;
		}
	};

	const hanldeUploadCancel = async (): Promise<void> => {
		imageFile = null;
	};

	const handleUploadCover = async (): Promise<void> => {
		coverUplaodStatus = Status.LOADING;
		try {
			if (taskDetails && taskDetails.id && imageFile) {
				await updateTaskCoverUrl(
					taskDetails?.id,
					imageFile,
					currentBoard.id,
					taskDetails.status.id,
				);
			}
			toast.success('Cover updated successfully');
		} catch (e: any) {
			console.log(e.message);
			toast.error('Failed to update cover! Try again later');
		} finally {
			coverUplaodStatus = Status.DONE;
		}
	};
</script>

{#if taskDetails}
	<Modal bind:open={isModalOpen} title="Task Details" size="lg" placement="center">
		<div class="w-screen max-w-[900px] min-h-[50rem] relative flex flex-col gap-4">
			{#if imageSrc}
				<div class="relative border h-48">
					<img src={imageSrc} alt="task-cover" class="h-48 rounded-lg w-full object-cover mb-4" />

					{#if imageSrc !== taskDetails.coverUrl}
						<div class="absolute bottom-2 right-2 flex items-center gap-x-2">
							<Button
								disabled={coverUplaodStatus === Status.LOADING}
								on:click={hanldeUploadCancel}
								type="button"
								size="xs"
								color="light"
							>
								Cancel
							</Button>
							<Button
								on:click={handleUploadCover}
								type="button"
								size="xs"
								color="green"
								class="px-6"
								disabled={coverUplaodStatus === Status.LOADING}
							>
								{#if coverUplaodStatus === Status.LOADING}
									<Spinner class="mr-3" size="4" color="white" />Uploading...
								{:else}
									Upload
								{/if}
							</Button>
						</div>
					{/if}
				</div>
			{:else}
				<Dropzone
					id="dropzone"
					on:change={handleFileChange}
					defaultClass="flex flex-col justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
				>
					<Icon class="text-3xl" icon="material-symbols:cloud-upload" />
					<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
						<span class="font-semibold">Click to upload</span> or drag and drop to add cover image
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
				</Dropzone>
			{/if}

			<div class="flex flex-col gap-y-2">
				<TaskTitle {taskDetails} />
				<TaskStatus {taskDetails} />
				<TaskPriority {taskDetails} />

				{#if taskDetails.labels.length > 0}
					<div class="flex mt-2 items-center gap-4">
						<p class="text-sm">Labels</p>
						<div class="flex flex-wrap sel gap-2">
							{#each taskDetails.labels as label}
								<Badge color={label.color} dismissable>
									{label.text}

									<svelte:fragment slot="closeBtn">
										<button
											on:click|stopPropagation={hanldeRemoveLabel}
											id={label.id}
											type="button"
											class="inline-flex items-center p-0.5 ml-2 text-sm bg-transparent rounded-sm text-blue-400 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
											aria-label="Remove"
										>
											<Icon icon="carbon:close-filled" />
											<span class="sr-only">Remove badge</span>
										</button>
									</svelte:fragment>
								</Badge>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="flex gap-8">
				<section class="flex-1 flex flex-col gap-y-4">
					<TaskDescription {taskDetails} />
				</section>

				<section class="w-80 flex flex-col gap-4">
					<CoverUploader {handleFileChange} />
					<SelectLabel on:labelSelected={hanldeAddLabel} />
				</section>
			</div>

			<TaskActivity {taskDetails} />
		</div>
	</Modal>
{/if}
