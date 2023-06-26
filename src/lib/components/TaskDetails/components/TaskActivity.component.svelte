<script lang="ts">
	import Comment from '$components/Comments/Comment.component.svelte';
	import APPWRITE_CONST from '$constants/appwrite.constants';
	import { AppwriteEvent } from '$enums/Events.enums';
	import { Status } from '$enums/Status.enums';
	import { appwriteClient } from '$lib/api/appwrite/client';
	import { getComments } from '$lib/api/appwrite/comments.api';

	import { extractEventFromString } from '$lib/helpers/eventParser.helper';
	import { enhanceComment } from '$lib/transformers/task.transformer';
	import type { CommentDoc } from '$types/appwriteDocs.types';
	import type { CommentType, Task } from '$types/kanban';
	import Icon from '@iconify/svelte';
	import { Spinner } from 'flowbite-svelte';
	import { onDestroy, onMount } from 'svelte';
	import AddComment from '$components/Comments/AddComment.component.svelte';

	export let taskDetails: Task;
	let taskId = taskDetails.id;

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

<AddComment {taskDetails} />

{#if commentFetchStatus === (Status.LOADING || Status.IDLE)}
	<div class="flex items-center justify-center">
		<Spinner color="purple" />
	</div>
{:else}
	{#each comments as comment}
		<Comment {comment} />
	{/each}
{/if}
