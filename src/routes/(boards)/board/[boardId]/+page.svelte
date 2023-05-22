<script lang="ts">
	import AuthGuard from '$components/Auth/AuthGuard.component.svelte';
	import { Avatar, Button, Drawer, Spinner } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import { getBoardData } from '$lib/api/appwrite/boards.api';
	import type { Board } from '$types/board';
	import { sineIn } from 'svelte/easing';
	import BoardDescription from '$components/BoardDescription/BoardDescription.component.svelte';
	import boardStore from '$lib/store/boards.store';
	import KanbanBoard from '$components/KanbanBoard/KanbanBoard.component.svelte';
	import { getkanbanBoard } from '$lib/api/appwrite/tasks.api';
	import type { KanbanBoardData } from '$types/kanban';
	import kanbanStore from '$lib/store/kanbanBoard.store';

	export let data: PageData;

	let boardData: Board;
	let kanbanBoard: KanbanBoardData;
	let isboardDataLoading = true;
	let isMenuClosed = true;

	onMount(async () => {
		try {
			boardData = await getBoardData(data.boardId);
			kanbanBoard = await getkanbanBoard();
			boardStore.update((prevState) => ({ ...prevState, currentBoard: boardData }));
			kanbanStore.update((prevState) => ({ ...prevState, kanbanBoard }));
		} catch (e) {
			// HANDLE ERROR
			console.error(e);
		} finally {
			isboardDataLoading = false;
		}
	});

	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn,
	};

	const openMenu = (): void => {
		isMenuClosed = false;
	};

	onDestroy(() => {
		boardStore.update((prevState) => ({ ...prevState, currentBoard: null }));
	});
</script>

<AuthGuard>
	<main class="board-page flex flex-col mx-auto px-2 sm:px-0">
		{#if isboardDataLoading}
			<div class="min-h-screen flex items-center justify-center -mt-20">
				<Spinner currentFill="#ef562f" />
			</div>
		{:else}
			<header class="flex my-4 gap-x-4 container mx-auto">
				<Button color="light">{boardData.isPrivate ? 'Private' : 'Public'}</Button>
				{#each boardData.members as member}
					<Avatar src={member.displayPicture} rounded />
				{/each}
				<Button color="alternative" class="ml-auto" on:click={openMenu}>Menu</Button>
			</header>

			<!-- TASK MANAGEMENT -->
			<KanbanBoard />

			<Drawer
				placement="right"
				width="max-w-[720px] w-full md:w-3/4"
				bind:hidden={isMenuClosed}
				transitionType="fly"
				{transitionParams}
			>
				<BoardDescription bind:isMenuClosed />
			</Drawer>
		{/if}
	</main>
</AuthGuard>

<style>
	.board-page {
		height: calc(100vh - 4rem);
	}
</style>
