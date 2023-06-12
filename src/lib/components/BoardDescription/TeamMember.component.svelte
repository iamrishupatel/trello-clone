<script lang="ts">
	import { removeMemberFromBoard } from '$lib/api/appwrite/boards.api';
	import { Status } from '$lib/enums/Status.enums';
	import { authStore } from '$lib/store';
	import boardStore from '$lib/store/boards.store';
	import type { Board, BoardMember } from '$lib/types/board';
	import type { AppwriteApiError } from '$lib/types/error.types';
	import { Avatar, Button, Spinner } from 'flowbite-svelte';
	import toast from 'svelte-french-toast';

	export let member: BoardMember;
	export let board: Board;

	let isRemoving = Status.IDLE;
	const handleRemove = async (): Promise<void> => {
		try {
			isRemoving = Status.LOADING;
			await removeMemberFromBoard(board.teamId, member.membershipId);
			toast.success('Member removed successfully');

			boardStore.update((store) => {
				if (store.currentBoard) {
					store.currentBoard.members = store.currentBoard?.members.filter(
						(user) => user.id !== member.id,
					);
				}
				return store;
			});
		} catch (e) {
			const error = e as AppwriteApiError;
			console.log(error);
			toast.error(error.message);
		} finally {
			isRemoving = Status.DONE;
		}
	};
</script>

<div class="flex items-center gap-x-4">
	<Avatar src={member.displayPicture} rounded size="sm" alt={member.name} />
	<p>{member.name}</p>

	<!-- ADMIN BADGE -->
	{#if member.id === board.owner.id}
		<p class="ml-auto text-xs">Admin</p>
	{/if}

	{#if $authStore.userDetails.id === board.owner.id && member.id !== board.owner.id}
		<div class="ml-auto">
			<!-- DISPAY ONLY TO ADMINS -->
			<Button
				color="red"
				outline={true}
				size="xs"
				on:click={handleRemove}
				disabled={isRemoving === Status.LOADING}
			>
				{#if isRemoving === Status.LOADING}
					<Spinner class="mr-3" size="4" color="white" />Removing...
				{:else}
					Remove
				{/if}
			</Button>
		</div>
	{/if}
</div>
