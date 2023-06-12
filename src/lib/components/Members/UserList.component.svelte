<script lang="ts">
	import { inviteUserToBoard } from '$lib/api/appwrite/boards.api';
	import type { User } from '$lib/types/user';
	import { Avatar, Button } from 'flowbite-svelte';
	import boardStore from '$lib/store/boards.store';
	import type { Board } from '$lib/types/board';
	import { onDestroy } from 'svelte';
	import toast from 'svelte-french-toast';
	import ERROR_TYPES from '$lib/constants/error.constants';
	import type { AppwriteApiError } from '$lib/types/error.types';

	export let users: User[] = [];

	let currentBoard: Board;

	const unsubscribe = boardStore.subscribe((store) => {
		const board = store.currentBoard as Board;
		currentBoard = board;
	});

	onDestroy(unsubscribe);

	const addMember = async (member: User): Promise<void> => {
		try {
			await inviteUserToBoard(currentBoard, member.email);
			toast.success('Invitation email sent successfully!');
		} catch (e) {
			const error = e as AppwriteApiError;
			if (error.type === ERROR_TYPES.TEAM_INVITE_ALREADY_EXISTS) {
				toast.success('Invitation already sent!');
			} else {
				toast.error(error.message);
			}
			console.error(e);
		}
	};
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type  -->
<div class="custom-scroll overflow-auto flex flex-col gap-4 max-h-48 p-4">
	{#each users as user}
		<div class="flex items-center">
			<Avatar src={user.displayPicture} alt={user.name} rounded border />
			<p class="ml-4 w-36 truncate">{user.name}</p>

			<Button size="xs" class="ml-auto" color="light" outline on:click={() => addMember(user)}
				>Add</Button
			>
		</div>
	{/each}
</div>

<style lang="scss">
	.custom-scroll {
		&::-webkit-scrollbar {
			width: 10px;
		}

		&::-webkit-scrollbar,
		&::-webkit-scrollbar-thumb {
			width: 26px;
			border-radius: 13px;
			background-clip: padding-box;
			border: 10px solid transparent;
		}

		&::-webkit-scrollbar-thumb {
			box-shadow: inset 0 0 0 10px;
		}
	}
</style>
