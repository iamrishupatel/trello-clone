<script lang="ts">
	import { updateComment } from '$lib/api/appwrite/comments.api';
	import { Button, Helper, Spinner } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import { createEventDispatcher } from 'svelte';
	import type { AppwriteApiError } from '$types/error.types';
	import { updateCommentValidationSchema } from '$lib/validations/task.validations';
	import RichTextEditor from '$components/common/RichTextEditor.component.svelte';
	import type { RichTextEditorChangeEventData } from '$lib/types/app.types';

	export let commentBody = '';
	export let commentId: string;
	let editor: RichTextEditor;

	const dispatch = createEventDispatcher();
	const dispatchCloseEvent = (): void => {
		dispatch('closeCommentEditor', commentBody);
	};

	const { form, errors, isSubmitting, handleSubmit } = createForm({
		initialValues: {
			body: commentBody,
			_bodyText: commentBody,
		},
		validationSchema: updateCommentValidationSchema,
		onSubmit: async (values) => {
			try {
				await updateComment(commentId, values.body);
				dispatch('closeCommentEditor', values.body);
			} catch (error: any) {
				const e = error as AppwriteApiError;
				console.error(e);
				if (e.code === 401) {
					errors.update((prevErrors) => ({
						...prevErrors,
						body: 'You can\'t update other user\'s comment',
					}));
				}
			}
		},
	});

	const handleEditorChange = (e: CustomEvent): void => {
		const data = e.detail as RichTextEditorChangeEventData;
		form.update((prev) => ({
			...prev,
			body: data.html ?? '',
			_bodyText: data.text.trim(),
		}));
	};
</script>

<form class="gap-2 mb-4" on:submit={handleSubmit}>
	<div class="mb-4">
		<RichTextEditor
			options={{
				placeholder: 'Please enter something.',
			}}
			bind:markdownContent={$form.body}
			bind:this={editor}
			on:change={handleEditorChange}
		/>
		<div>
			{#if $errors.body || $errors._bodyText}
				<Helper color="red"
					><span class="font-medium">{$errors.body ? $errors.body : $errors._bodyText}</span
					></Helper
				>
			{/if}
		</div>
	</div>
	<Button
		type="button"
		size="xs"
		color="red"
		outline
		on:click={dispatchCloseEvent}
		disabled={$isSubmitting}
	>
		Cancel
	</Button>
	<Button type="submit" size="xs" disabled={$isSubmitting} color="green" outline>
		{#if $isSubmitting}
			<Spinner class="mr-3" size="4" color="white" />Updating...
		{:else}
			Update comment
		{/if}
	</Button>
</form>
