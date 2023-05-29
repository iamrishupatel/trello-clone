<script lang="ts">
	import { createNewTask } from '$lib/api/appwrite/tasks.api';
	import { kanbanStore } from '$lib/store';
	import boardStore from '$lib/store/boards.store';
	import type { Board } from '$types/board';
	import type { CreateNewTasksFormValues } from '$types/formValues';
	import createTaskFormSchema from '$validations/createTask.validation';
	import Icon from '@iconify/svelte';
	import {
		Button,
		Dropzone,
		Helper,
		Input,
		Label,
		Modal,
		Select,
		Spinner,
		Textarea,
	} from 'flowbite-svelte';
	import type { ButtonColorType } from 'flowbite-svelte/dist/types';
	import { onDestroy } from 'svelte';
	import { createForm } from 'svelte-forms-lib';

	export let defaultStatusId = '';
	export let color: ButtonColorType = 'primary';
	export let outline = false;
	export let btnClass = '';

	let currentBoard: Board;

	const unsub = boardStore.subscribe((store) => {
		if (store.currentBoard) {
			currentBoard = store.currentBoard;
		}
	});

	onDestroy(unsub);

	let isModalOpen = false;
	const handleClick = (): void => {
		isModalOpen = true;
	};

	let availableStatus = Object.keys($kanbanStore.kanbanBoard).map((columnId) => {
		return {
			value: columnId,
			name: $kanbanStore.kanbanBoard[columnId].columnName,
		};
	});

	const initialValues: CreateNewTasksFormValues = {
		title: '',
		description: '',
		statusId: defaultStatusId ?? '',
		file: '',
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit, handleReset } = createForm({
		initialValues,
		validationSchema: createTaskFormSchema,
		onSubmit: async (values) => {
			await createNewTask(currentBoard.id, values);
			handleReset();
			isModalOpen = false;
		},
	});

	// IMAGE PREVIEW SRC
	let src = '';

	// make src reactive to file so when form resets
	// src will be reseted as well
	$: {
		if ($form.file) {
			src = typeof $form.file === 'string' ? $form.file : URL.createObjectURL($form.file);
		} else {
			src = '';
		}
	}

	const handleFileChange = (e: any): void => {
		const file = e.target?.files[0];

		if (file) {
			form.update((prevState) => ({
				...prevState,
				file: file,
			}));
		}
	};

	const removeCover = (): void => {
		form.update((prevState) => ({ ...prevState, file: '' }));
	};

	const handleCancel = (): void => {
		handleReset();
		isModalOpen = false;
	};
</script>

<Button
	on:click={handleClick}
	class={btnClass ? btnClass : 'ml-auto'}
	{outline}
	color={color ?? 'primary'}
>
	<slot />
</Button>

<Modal bind:open={isModalOpen} size="lg" title="Create Task">
	<form on:submit={handleSubmit} class="w-screen max-w-[900px]">
		{#if src}
			<div class="relative flex w-full h-48 rounded-lg border-2 border-gray-300 border-dashed">
				<div class="absolute -right-2 -top-2">
					<Button class="!p-2" size="xl" type="button" on:click={removeCover}
						><Icon icon="mdi:multiply" /></Button
					>
				</div>
				<img {src} alt="" class=" rounded-lg w-full object-cover" />
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

		<!-- details -->
		<div class="details-container mt-8">
			<!-- title and description -->
			<section class="flex flex-col gap-y-4">
				<div>
					<Label>Task Title</Label>
					<Input
						name="title"
						id="title"
						type="text"
						placeholder="Enter task name"
						bind:value={$form.title}
						on:change={handleChange}
						color={$errors.title ? 'red' : 'base'}
					/>
					{#if $errors.title}
						<Helper color="red"><span class="font-medium">{$errors.title}</span></Helper>
					{/if}
				</div>

				<div>
					<Label>Task Description</Label>
					<Textarea
						id="description"
						name="description"
						rows={5}
						placeholder="Enter description"
						bind:value={$form.description}
						on:change={handleChange}
						class={$errors.description
							? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400'
							: ''}
					/>
					{#if $errors.description}
						<Helper color="red">
							<span class="font-medium">{$errors.description}</span>
						</Helper>
					{/if}
				</div>
			</section>

			<section>
				<div>
					<Label>{defaultStatusId ? 'Status' : 'Select a status'}</Label>
					<Select
						items={availableStatus}
						bind:value={$form.statusId}
						class={$errors.statusId
							? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400'
							: ''}
						disabled={defaultStatusId ? true : false}
					/>
					{#if $errors.statusId}
						<Helper color="red">
							<span class="font-medium">{$errors.statusId}</span>
						</Helper>
					{/if}
				</div>
			</section>
		</div>

		<!-- FORM ACTIONS -->
		<div class="flex gap-x-4 mt-4">
			<Button type="submit">
				{#if $isSubmitting}
					<Spinner class="mr-3" size="4" color="white" />Creating...
				{:else}
					Create
				{/if}
			</Button>
			<Button color="alternative" type="button" on:click={handleCancel}>Cancel</Button>
		</div>
	</form>
</Modal>

<style lang="scss">
	.details-container {
		display: grid;
		grid-template-columns: 2fr 1fr;
		column-gap: 2rem;
	}
</style>
