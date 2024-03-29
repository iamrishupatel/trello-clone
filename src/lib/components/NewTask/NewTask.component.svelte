<script lang="ts">
	import SelectLabel from '$components/NewTask/SelectLabel.component.svelte';
	import { TASK_PRIORITIES } from '$constants/app.constans';
	import { createNewTask } from '$lib/api/appwrite/tasks.api';
	import { kanbanStore } from '$lib/store';
	import boardStore from '$lib/store/boards.store';
	import type { Board } from '$types/board';
	import type { CreateNewTasksFormValues } from '$types/formValues';
	import { createTaskFormSchema } from '$lib/validations/task.validations';
	import Icon from '@iconify/svelte';
	import { Button, Dropzone, Helper, Input, Label, Modal, Select, Spinner } from 'flowbite-svelte';
	import type { ButtonColorType } from 'flowbite-svelte/dist/types';
	import { onDestroy } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import RichTextEditor from '$components/common/RichTextEditor.component.svelte';
	import type { RichTextEditorChangeEventData } from '$lib/types/app.types';

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
		labels: [],
		priorityId: '',
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

	const handleAddLabel = (e: CustomEvent): void => {
		form.update((formData) => {
			if (formData.labels.some((label) => label.id === e.detail.id)) {
				return formData;
			} else {
				formData.labels.push(e.detail);
				return formData;
			}
		});
	};

	const handleRemoveLabel = (e: CustomEvent): void => {
		const removedLabelId = e.detail;
		form.update((formData) => {
			if (formData.labels.some((label) => label.id === removedLabelId)) {
				formData.labels = formData.labels.filter((label) => label.id !== removedLabelId);
				return formData;
			} else {
				return formData;
			}
		});
	};

	const handleCancel = (e: Event): void => {
		e.stopPropagation();
		handleReset();
		isModalOpen = false;
	};

	const handleEditorChange = (e: CustomEvent): void => {
		const data = e.detail as RichTextEditorChangeEventData;

		form.update((prev) => ({
			...prev,
			description: data.text.trim().length === 0 ? '' : data.html ?? '',
		}));
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
		<div class="flex gap-x-4 mt-8">
			<!-- title and description -->
			<section class="flex flex-1 flex-col gap-y-4">
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
					<div class="flex flex-col h-96">
						<Label>Task Description</Label>
						<RichTextEditor
							options={{
								placeholder: 'Enter description.',
							}}
							bind:markdownContent={$form.description}
							on:change={handleEditorChange}
						/>
					</div>

					{#if $errors.description}
						<Helper color="red">
							<span class="font-medium">{$errors.description}</span>
						</Helper>
					{/if}
				</div>
			</section>

			<section class="flex flex-col gap-4 w-80">
				<div>
					<Label>Status</Label>
					<Select
						name="statusId"
						items={availableStatus}
						bind:value={$form.statusId}
						on:change={handleChange}
						class={$errors.statusId
							? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400'
							: ' '}
						disabled={defaultStatusId ? true : false}
					/>
					{#if $errors.statusId}
						<Helper color="red">
							<span class="font-medium">{$errors.statusId}</span>
						</Helper>
					{/if}
				</div>

				<div>
					<Label>Priority</Label>
					<Select
						name="priorityId"
						items={TASK_PRIORITIES.map(({ id, text }) => ({ name: text, value: id }))}
						bind:value={$form.priorityId}
						on:change={handleChange}
						class={$errors.priorityId
							? 'capitalize bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400'
							: 'capitalize'}
					/>
					{#if $errors.priorityId}
						<Helper color="red">
							<span class="font-medium">{$errors.priorityId}</span>
						</Helper>
					{/if}
				</div>

				<div>
					<Label>Labels</Label>
					<SelectLabel
						on:labelSelected={handleAddLabel}
						on:removeLabel={handleRemoveLabel}
						selectedLabels={$form.labels}
					/>
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
