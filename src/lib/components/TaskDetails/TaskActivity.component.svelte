<script lang="ts">
	import Comment from '$components/Comments/Comment.component.svelte';
	import APPWRITE_CONST from '$constants/appwrite.constants';
	import { AppwriteEvent } from '$enums/Events.enums';
	import { Status } from '$enums/Status.enums';
	import { appwriteClient } from '$lib/api/appwrite/client';
	import { createNewComment, getComments } from '$lib/api/appwrite/comments.api';

	import { extractEventFromString } from '$lib/helpers/eventParser.helper';
	import { authStore } from '$lib/store';
	import { enhanceComment } from '$lib/transformers/task.transformer';
	import type { CommentDoc } from '$types/appwriteDocs.types';
	import type { AuthState, UserDetails } from '$types/authStore';
	import type { CreateCommentFormValues } from '$types/formValues';
	import type { CommentType } from '$types/kanban';
	import { createCommentValidationSchema } from '$lib/validations/task.validations';
	import Icon from '@iconify/svelte';
	import { Avatar, Helper, Spinner } from 'flowbite-svelte';
	import { Textarea, Button } from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { createForm } from 'svelte-forms-lib';

	export let taskId: string;

	let userDetails: UserDetails = $authStore.userDetails;
	let isAnonymous: boolean = $authStore.isAnonymous;

	authStore.subscribe((authStore: AuthState) => {
		if (authStore.userDetails) {
			userDetails = authStore.userDetails;
		}
	});

	const initialValues: CreateCommentFormValues = {
		body: '',
		authorId: userDetails.id,
	};
	const { form, errors, isSubmitting, handleChange, handleReset, handleSubmit } = createForm({
		initialValues,
		validationSchema: createCommentValidationSchema,
		onSubmit: async (values) => {
			try {
				await createNewComment(taskId, values, isAnonymous);
				handleReset();
			} catch (e) {
				console.log(e);
			}
		},
	});

	let unsub: () => void;
	let commentFetchStatus = Status.IDLE;
	let comments: CommentType[] = [];

	onMount(async () => {
		commentFetchStatus = Status.LOADING;
		comments = await getComments(taskId);
		commentFetchStatus = Status.DONE;

		unsub = appwriteClient.subscribe(APPWRITE_CONST.COMMENTS_CHANNEL, async (res) => {
			const event = extractEventFromString(res.events[0]);

			const payload = res.payload as CommentDoc;
			const commentTaskId = payload?.taskId ?? '';
			if (commentTaskId !== taskId) {
				return;
			}

			let enhancedComment: CommentDoc | CommentType = payload;
			if (event !== AppwriteEvent.DELETE) {
				enhancedComment = await enhanceComment(payload);
			}

			switch (event) {
				case AppwriteEvent.CREATE:
					comments = [enhancedComment as CommentType, ...comments];
					break;

				case AppwriteEvent.UPDATE:
					comments = comments.map((commentItem) => {
						if (commentItem.id === enhancedComment.id) {
							return enhancedComment as CommentType;
						}
						return commentItem;
					});
					break;
				case AppwriteEvent.DELETE:
					comments = comments.filter((commentItem) => commentItem.id !== payload.$id);
					break;
			}
		});
	});

	onDestroy(() => {
		if (unsub && typeof unsub === 'function') {
			unsub();
		}
	});
</script>

<div class="flex items-center gap-x-4">
	<p class="flex items-center gap-x-2">
		<Icon class="text-xl" icon="material-symbols:comment" />
		<span> Activity </span>
	</p>
</div>
<form class="flex gap-2 mb-4" on:submit={handleSubmit}>
	<Avatar src={userDetails.displayPicture} rounded alt={userDetails.name} />

	<div class="flex-1">
		<Textarea
			class="mb-2"
			placeholder="Write a comment"
			name="body"
			rows="5"
			bind:value={$form.body}
			on:change={handleChange}
		>
			<div slot="footer" class="flex items-center justify-between">
				<Button type="submit" disabled={$isSubmitting}>
					{#if $isSubmitting}
						<Spinner class="mr-3" size="4" color="white" />Posting...
					{:else}
						Post comment
					{/if}
				</Button>
			</div>
		</Textarea>
		{#if $errors.body}
			<Helper color="red"><span class="font-medium">{$errors.body}</span></Helper>
		{/if}
	</div>
</form>

{#if commentFetchStatus === (Status.LOADING || Status.IDLE)}
	<div class="flex items-center justify-center">
		<Spinner color="purple" />
	</div>
{:else}
	{#each comments as comment}
		<Comment {comment} />
	{/each}
{/if}
