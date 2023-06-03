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
	import Icon from '@iconify/svelte';
	import NewTask from '$components/KanbanBoard/NewTask.component.svelte';
	import { appwriteClient } from '$lib/api/appwrite/client';
	import APPWRITE_CONST from '$constants/appwrite.constants';
	import { extractEventFromString } from '$lib/helpers/eventParser.helper';
	import {
		hanldeTaskCreateEvent,
		hanldeTaskDeleteEvent,
		hanldeTaskUpdateEvent,
	} from '$lib/api/appwrite/eventHandlers';

	export let data: PageData;

	let boardData: Board;
	let kanbanBoard: KanbanBoardData;
	let isboardDataLoading = true;
	let isMenuClosed = true;
	let unsub: () => void;

	onMount(async () => {
		try {
			boardData = await getBoardData(data.boardId);
			boardStore.update((prevState) => ({
				...prevState,
				currentBoard: boardData,
				labels: data.labels.map((label: any) => ({
					id: label.$id,
					text: label.text,
					color: label.color,
				})),
			}));

			kanbanBoard = await getkanbanBoard(data.boardId);
			kanbanStore.update((prevState) => ({ ...prevState, kanbanBoard }));

			// subscribe to appwrite task collection channel for updates
			unsub = appwriteClient.subscribe(APPWRITE_CONST.TASK_CHANNEL, (res) => {
				const event = extractEventFromString(res.events[0]);

				switch (event) {
					case 'create':
						hanldeTaskCreateEvent(res.payload, data.boardId);
						break;
					case 'update':
						hanldeTaskUpdateEvent(res.payload, data.boardId);
						break;
					case 'delete':
						hanldeTaskDeleteEvent(res.payload, data.boardId);
						break;
				}
			});
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
		if (unsub && typeof unsub === 'function') {
			unsub();
		}
	});
</script>

<AuthGuard>
	<title>{`${data.boardDoc.name ?? ''} | Krello`}</title>
	<main class="board-page flex flex-col mx-auto px-2 sm:px-0">
		{#if isboardDataLoading}
			<div class="min-h-screen flex items-center justify-center -mt-20">
				<Spinner currentFill="#ef562f" />
			</div>
		{:else}
			<header class="flex my-4 gap-x-4 container mx-auto">
				<Button color="light">
					{#if boardData.isPrivate}
						<span class="flex items-center gap-x-2">
							<Icon icon="ic:round-lock" />
							<span> Private </span>
						</span>
					{:else}
						<span class="flex items-center gap-x-2">
							<Icon icon="subway:world-1" />
							<span> Public </span>
						</span>
					{/if}
				</Button>
				{#each boardData.members as member}
					<Avatar src={member.displayPicture} rounded />
				{/each}

				<NewTask>
					<Icon icon="material-symbols:add" />
					<span class="ml-2">Add new task</span>
				</NewTask>

				<Button color="alternative" on:click={openMenu}>
					<Icon icon="mingcute:dot-grid-fill" />
					<span class="ml-2"> Menu </span>
				</Button>
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
