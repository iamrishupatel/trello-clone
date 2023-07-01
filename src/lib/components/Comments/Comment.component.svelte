<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	import moment from 'moment';
	import type { CommentType } from '$types/kanban';
	import toast from 'svelte-french-toast';
	import { deleteComment } from '$lib/api/appwrite/comments.api';
	import type { AppwriteApiError } from '$types/error.types';
	import type { UserDetails } from '$types/authStore';
	import { authStore } from '$lib/store';
	import EditComment from './EditComment.component.svelte';
	import RichTextViewer from '$components/common/RichTextViewer.component.svelte';

	export let comment: CommentType;

	const hanldeDeleteComment = async (): Promise<void> => {
		let toastId = toast.loading('Deleting comment...');
		try {
			await deleteComment(comment.id);
			toast.success('Deleted Successfully', {
				id: toastId,
			});
		} catch (error: unknown) {
			const e = error as AppwriteApiError;
			console.error(e);
			if (e.code === 401) {
				toast.error('You can\'t delete other user\'s comment', {
					id: toastId,
				});
			}
		}
	};

	let userDetails: UserDetails = $authStore.userDetails;
	let isCurrentUserAnon: boolean = $authStore.isAnonymous;

	let isEditingComment = false;
	const openCommentEditor = (): void => {
		isEditingComment = true;
	};
	const closeCommentEditor = (e: CustomEvent): void => {
		comment = {
			...comment,
			body: e.detail,
		};
		isEditingComment = false;
	};
</script>

<div class="flex flex-col gap-4 mb-8">
	<div class="flex justify-between">
		<div class="w-fit flex gap-2">
			<Avatar src={comment.author.displayPicture} rounded />
			<div class="flex flex-col">
				<p>
					<span>
						{comment.author.name}
					</span>
					{#if comment.isEdited}
						<span class="text-xs ml-1"><em>edited</em></span>
					{/if}
				</p>
				<p class="text-xs">{moment(comment.createdAt).format('DD MMMM [at] hh:mm A')}</p>
			</div>
		</div>
	</div>
	{#if isEditingComment}
		<EditComment
			commentId={comment.id}
			commentBody={comment.body}
			on:closeCommentEditor={closeCommentEditor}
		/>
	{:else}
		<div class="border px-4 bg-gray-50 rounded-lg">
			<RichTextViewer source={comment.body ?? ''} />
		</div>
		<div class="flex items-center gap-x-2 -mt-2">
			{#if comment.author.id === userDetails.id || comment.author.isAnonymous === isCurrentUserAnon}
				<div class="flex gap-2 text-sm items-center">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<p class="hover:underline cursor-pointer" on:click|stopPropagation={openCommentEditor}>
						<strong> Edit</strong>
					</p>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<p class="hover:underline cursor-pointer" on:click|stopPropagation={hanldeDeleteComment}>
						<strong> Delete </strong>
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
