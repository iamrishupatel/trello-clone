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

	export let data: PageData;

	let boardData: Board;
	let isboardDataLoading = true;
	let isMenuClosed = true;

	onMount(async () => {
		try {
			boardData = await getBoardData(data.boardId);
			boardStore.update((prevState) => ({ ...prevState, currentBoard: boardData }));
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
	<main class="flex flex-col container mx-auto px-2 sm:px-0">
		{#if isboardDataLoading}
			<div class="min-h-screen flex items-center justify-center -mt-20">
				<Spinner currentFill="#ef562f" />
			</div>
		{:else}
			<header class="flex my-4 gap-x-4">
				<Button color="light">{boardData.isPrivate ? 'Private' : 'Public'}</Button>
				{#each boardData.members as member}
					<Avatar src={member.displayPicture} rounded />
				{/each}
				<Button color="alternative" class="ml-auto" on:click={openMenu}>Menu</Button>
			</header>

			<!-- TASK MANAGEMENT -->
			<section class="bg-[#F8F9FD] p-6 rounded-3xl h-96">Board to add</section>

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
