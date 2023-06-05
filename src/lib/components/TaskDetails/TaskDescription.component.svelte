<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button, Helper, Label, Spinner, Textarea } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import styles from '$sass/markdown.module.scss';
	import SvelteMarkdown from 'svelte-markdown';
	import { updateTaskDescription } from '$lib/api/appwrite/tasks.api';

	export let taskDescription = '',
		taskId: string;
	let isEditing = false;

	const openDescriptionEditor = (): void => {
		isEditing = true;
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues: {
			description: taskDescription ?? '',
		},
		onSubmit: async (values) => {
			await updateTaskDescription(taskId, values.description);
		},
		// FIXME:
		// validationSchema: ,
	});

	const handleCancel = (): void => {
		form.update((prev) => ({ ...prev, description: taskDescription ?? '' }));
		isEditing = false;
	};
</script>

<div class="flex items-center gap-x-4">
	<p class="flex items-center gap-x-2">
		<Icon icon="basil:document-solid" />
		Description
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
		<div>
			<Label for="board-description" class="sr-only">Add a description</Label>
			<Textarea
				id="board-description"
				placeholder="Add a description."
				rows={12}
				name="description"
				bind:value={$form.description}
				on:change={handleChange}
				class={$errors.description
					? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400'
					: ''}
			/>

			<Helper color={$errors.description ? 'red' : 'gray'}>
				<span class="font-medium">
					{$errors.description ? $errors.description : 'Use mardown format.'}
				</span>
			</Helper>
		</div>
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
	<div class={`${styles.markdown} mt-4`}>
		<SvelteMarkdown source={taskDescription ?? ''} />
	</div>
{/if}
