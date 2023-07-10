<script lang="ts">
	import RichTextEditor from '$components/common/RichTextEditor.component.svelte';
	import { createNewComment } from '$lib/api/appwrite/comments.api';
	import { authStore } from '$lib/store';
	import type { RichTextEditorChangeEventData } from '$lib/types/app.types';
	import type { UserDetails, AuthState } from '$lib/types/authStore';
	import type { CreateCommentFormValues } from '$lib/types/formValues';
	import type { Task } from '$lib/types/kanban';
	import { createCommentValidationSchema } from '$lib/validations/task.validations';
	import { Avatar, Button, Spinner, Helper } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { createForm } from 'svelte-forms-lib';

	export let taskDetails: Task;

	let userDetails: UserDetails = $authStore.userDetails;
	let isAnonymous: boolean = $authStore.isAnonymous;
	let editor: RichTextEditor;

	const unsub = authStore.subscribe((authStore: AuthState) => {
		if (authStore.userDetails) {
			userDetails = authStore.userDetails;
		}
	});
	onDestroy(unsub);

	const initialValues: CreateCommentFormValues = {
		body: '', // actual comment
		_bodyText: '', // only used for validation purposes
		authorId: userDetails.id,
	};
	const { form, errors, isSubmitting, handleReset, handleSubmit } = createForm({
		initialValues,
		validationSchema: createCommentValidationSchema,
		onSubmit: async (values) => {
			try {
				await createNewComment(taskDetails.id, values, isAnonymous);
				editor && editor.resetEditor();
				handleReset();
			} catch (e) {
				console.log(e);
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

<form class="flex gap-2 mb-4" on:submit={handleSubmit}>
	<Avatar src={userDetails.displayPicture} rounded alt={userDetails.name} />

	<div class="flex flex-col flex-1 h-72">
		<RichTextEditor
			options={{
				placeholder: 'Write a comment.',
			}}
			bind:markdownContent={$form.body}
			bind:this={editor}
			on:change={handleEditorChange}
		/>

		{#if $errors.body || $errors._bodyText}
			<Helper color="red"
				><span class="font-medium">{$errors.body ? $errors.body : $errors._bodyText}</span></Helper
			>
		{/if}
		<Button type="submit" class="w-fit mt-2" disabled={$isSubmitting}>
			{#if $isSubmitting}
				<Spinner class="mr-3" size="4" color="white" />Posting...
			{:else}
				Post comment
			{/if}
		</Button>
	</div>
</form>
