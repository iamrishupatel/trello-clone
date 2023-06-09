<script lang="ts">
	import { updateCommentValidationSchema } from '$validations/comment.validation';
	import { updateComment } from '$lib/api/appwrite/comments.api';
	import { Button, Helper, Spinner, Textarea } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import { createEventDispatcher } from 'svelte';
	import type { AppwriteApiError } from '$types/error.types';

	export let commentBody = '';
	export let commentId: string;

	const dispatch = createEventDispatcher();
	const dispatchCloseEvent = (): void => {
		dispatch('closeCommentEditor');
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues: {
			body: commentBody,
		},
		validationSchema: updateCommentValidationSchema,
		onSubmit: async (values) => {
			try {
				await updateComment(commentId, values.body);
				dispatch('closeCommentEditor');
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
</script>

<form class="flex gap-2 mb-4" on:submit={handleSubmit}>
	<div class="flex-1">
		<Textarea
			class="mb-2"
			placeholder="Write a comment"
			name="body"
			rows="5"
			bind:value={$form.body}
			on:change={handleChange}
		>
			<div slot="footer" class="flex items-center gap-x-2">
				<Button
					type="button"
					size="xs"
					color="red"
					outline
					on:click={dispatchCloseEvent}
					disabled={$isSubmitting}>Cancel</Button
				>
				<Button type="submit" size="xs" disabled={$isSubmitting} color="green" outline>
					{#if $isSubmitting}
						<Spinner class="mr-3" size="4" color="white" />Updating...
					{:else}
						Update comment
					{/if}
				</Button>
			</div>
		</Textarea>
		{#if $errors.body}
			<Helper color="red"><span class="font-medium">{$errors.body}</span></Helper>
		{/if}
	</div>
</form>
