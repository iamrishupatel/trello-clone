<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button, Search, Spinner } from 'flowbite-svelte';
	import Dropdown from '../common/Dropdown/Dropdown.component.svelte';
	import { Status } from '$lib/enums/Status.enums';
	import type { User } from '$lib/types/user';
	import { onDestroy, onMount } from 'svelte';
	import { getBulkUserData } from '$lib/api/appwrite/userDetails.api';
	import UserList from './UserList.component.svelte';
	import boardStore from '$lib/store/boards.store';
	import type { Board } from '$lib/types/board';

	let currentBoardMemberIds: string[] = [];
	let currentBoard: Board;

	const unsubscribe = boardStore.subscribe((store) => {
		if (store.currentBoard) {
			const board = store.currentBoard as Board;
			currentBoard = board;
			currentBoardMemberIds = board.members.map((member) => member.id);
		}
	});

	onDestroy(unsubscribe);

	let isDropdownOpen = false;
	const toggleDropdown = (): void => {
		isDropdownOpen = !isDropdownOpen;
	};

	let users: User[] = [];
	let searchResult: User[] = [];
	let searchVal = '';
	let membersLoadingStatus = Status.IDLE;

	$: {
		searchResult = users.filter((member) => {
			if (member.name.toLowerCase().includes(searchVal.trim().toLowerCase())) {
				return true;
			}
			return false;
		});
	}

	onMount(async () => {
		membersLoadingStatus = Status.LOADING;
		try {
			const userData = await getBulkUserData();
			const nonMembers: User[] = [];

			userData.forEach((user) => {
				if (!currentBoardMemberIds.includes(user.id)) {
					nonMembers.push(user);
				}
			});

			users = searchResult = nonMembers;
		} catch (e) {
			console.error(e);
		} finally {
			membersLoadingStatus = Status.DONE;
		}
	});
</script>

{#if currentBoard.isPrivate}
	<Dropdown bind:isDropdownOpen>
		<Button slot="action" color="light" class="!p-3" size="lg" on:click={toggleDropdown}>
			<Icon icon="fluent:add-12-filled" />
		</Button>

		<div slot="dropdown" class="bg-white rounded-lg mt-2 border-2 p-4 flex flex-col gap-2">
			<div>
				<strong>Members</strong>
				<p class="text-sm">Choose who can see this board</p>
			</div>

			<Search size="sm" bind:value={searchVal} />
			{#if membersLoadingStatus === Status.LOADING}
				<Spinner />
			{/if}

			{#if searchResult.length === 0 && membersLoadingStatus === Status.DONE}
				<div class="self-center flex items-center gap-2">
					<Icon icon="fluent-emoji-high-contrast:empty-nest" class="text-md" />
					<p>{searchVal ? 'No users found' : 'No more users'}</p>
				</div>
			{:else}
				<UserList users={searchResult} />
			{/if}
		</div>
	</Dropdown>
{/if}
