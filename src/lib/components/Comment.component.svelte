<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import styles from '$sass/markdown.module.scss';
	import moment from 'moment';
	import type { CommentType } from '$types/kanban';
	import toast from 'svelte-french-toast';
	import { deleteComment } from '$lib/api/appwrite/comments.api';
	import type { AppwriteApiError } from '$types/error.types';
	import type { UserDetails } from '$types/authStore';
	import { authStore } from '$lib/store';

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
	let isEditingComment = false;
	const openCommentEditor = (): void => {
		isEditingComment = true;
		console.log(isEditingComment);
	};
</script>

<div class="flex flex-col gap-4 mb-8">
	<div class="flex justify-between">
		<div class="w-fit flex gap-2">
			<Avatar src={comment.author.displayPicture} rounded />
			<div class="flex flex-col">
				<p>{comment.author.name}</p>
				<p class="text-xs">{moment(comment.createdAt).format('DD MMMM [at] hh:mm A')}</p>
			</div>
		</div>
		{#if comment.author.id === userDetails.id || true}
			<div class="flex gap-2 text-sm">
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
	<div class={`${styles.markdown} border px-4 bg-gray-50 rounded-lg`}>
		<SvelteMarkdown source={comment.body ?? ''} />
	</div>
</div>
