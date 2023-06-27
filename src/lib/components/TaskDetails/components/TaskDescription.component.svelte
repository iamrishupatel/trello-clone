<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button, Helper, Label, Spinner } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import styles from '$sass/markdown.module.scss';
	import SvelteMarkdown from 'svelte-markdown';
	import { updateTaskDescription } from '$lib/api/appwrite/tasks.api';
	import { onDestroy } from 'svelte';
	import type { Board } from '$lib/types/board';
	import boardStore from '$lib/store/boards.store';
	import type { Task } from '$lib/types/kanban';
	import RichTextEditor from '$components/common/RichTextEditor.component.svelte';
	import type { RichTextEditorChangeEventData } from '$lib/types/app.types';

	export let taskDetails: Task;
	let taskDescription = taskDetails.description;
	let richTextEditor: RichTextEditor;

	const taskId = taskDetails.id;
	let isEditing = false;

	let currentBoard: Board;
	const unsub = boardStore.subscribe((store) => {
		currentBoard = store.currentBoard as Board;
	});

	onDestroy(unsub);

	const openDescriptionEditor = (): void => {
		isEditing = true;
	};

	const { form, errors, isSubmitting, handleSubmit } = createForm({
		initialValues: {
			description: taskDescription ?? '',
		},
		onSubmit: async (values) => {
			await updateTaskDescription(
				taskId,
				values.description,
				currentBoard.id,
				taskDetails.status.id,
			);
			taskDescription = values.description;
			isEditing = false;
		},
	});

	const handleCancel = (): void => {
		form.update((prev) => ({ ...prev, description: taskDescription ?? '' }));
		isEditing = false;
	};

	const handleEditorChange = (e: CustomEvent): void => {
		const data = e.detail as RichTextEditorChangeEventData;

		form.update((prev) => ({
			...prev,
			description: data.text.trim().length === 0 ? '' : data.html ?? '',
		}));
	};
</script>

<div class="flex items-center gap-x-4">
	<p class="flex items-center gap-x-2">
		<Icon class="text-xl" icon="basil:document-solid" />
		<span> Description </span>
	</p>
	{#if !isEditing && taskDescription}
		<Button color="light" size="xs" on:click={openDescriptionEditor}>
			<span class="flex items-center gap-x-2 text-gray-500">
				<Icon icon="material-symbols:edit" />
				Edit
			</span>
		</Button>
	{/if}
</div>
{#if !isEditing && !taskDescription}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="border cursor-pointer bg-slate-100 hover:bg-slate-200 text-sm h-20 p-2 rounded"
		on:click={openDescriptionEditor}
	>
		Add a more detailed description....
	</div>
{/if}

{#if isEditing}
	<form on:submit={handleSubmit}>
		<div class="flex flex-col h-96">
			<Label for="board-description" class="sr-only">Add a description</Label>
			<RichTextEditor
				options={{
					placeholder: 'Add a more detailed description',
				}}
				bind:markdownContent={$form.description}
				bind:this={richTextEditor}
				on:change={handleEditorChange}
			/>
		</div>
		<Helper color="red">
			<span class="font-medium">
				{$errors.description}
			</span>
		</Helper>
		<div class="flex items-center gap-x-4 mt-2">
			<Button color="green" type="submit" size="sm" disabled={$isSubmitting}>
				{#if $isSubmitting}
					<Spinner class="mr-3" size="4" color="white" />Updating...
				{:else}
					Update
				{/if}
			</Button>

			<Button color="light" type="button" size="sm" on:click={handleCancel}>Cancel</Button>
		</div>
	</form>
{:else}
	<div class={`${styles.markdown}`}>
		<SvelteMarkdown source={taskDescription ?? ''} />
	</div>
{/if}
