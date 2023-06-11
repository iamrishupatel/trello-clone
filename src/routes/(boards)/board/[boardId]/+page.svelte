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
	import NewTask from '$components/NewTask/NewTask.component.svelte';
	import { appwriteClient } from '$lib/api/appwrite/client';
	import APPWRITE_CONST from '$constants/appwrite.constants';
	import { extractEventFromString } from '$lib/helpers/eventParser.helper';
	import {
		hanldeTaskCreateEvent,
		hanldeTaskDeleteEvent,
		hanldeTaskUpdateEvent,
	} from '$lib/api/appwrite/eventHandlers';
	import BoardPrivacy from '$components/BoardPrivacy.component.svelte';
	import { authStore } from '$lib/store';
	import type { AuthState } from '$lib/types/authStore';
	import ERROR_TYPES from '$lib/constants/error.constants';
	import type { AppwriteApiError } from '$lib/types/error.types';
	import ErrorDisplay from '$components/common/ErrorDisplay.component.svelte';

	export let data: PageData;

	let boardData: Board;
	let kanbanBoard: KanbanBoardData;
	let isboardDataLoading = true;
	let errorInBoard = '';
	let isMenuClosed = true;
	let authDetails: AuthState;
	let unsub: () => void;

	authStore.subscribe((store) => {
		authDetails = store;
	});

	onMount(async () => {
		try {
			boardData = await getBoardData(data.boardId);
			// Check if the board is private and the current user is not a member
			// If so, display an access denied message immediately and stop further processing
			if (
				boardData.isPrivate &&
				!boardData.members.some((member) => {
					return member.id === authDetails.userDetails?.id;
				})
			) {
				errorInBoard = ERROR_TYPES.ACCESS_DENIED;
				throw new Error(ERROR_TYPES.ACCESS_DENIED);
			}

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
		} catch (error) {
			const e = error as AppwriteApiError;
			console.error(e);
			if (e.type === ERROR_TYPES.DOCUMENT_NOT_FOUND) {
				errorInBoard = ERROR_TYPES.DOCUMENT_NOT_FOUND;
			}
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

	console.log({ errorInBoard });
</script>

{#if errorInBoard === ERROR_TYPES.ACCESS_DENIED || errorInBoard === ERROR_TYPES.DOCUMENT_NOT_FOUND}
	<ErrorDisplay
		errorDescription="Sorry, the page you are looking for cannot be found or you do not have permission to view it."
	/>
{:else}
	<AuthGuard>
		<main class="board-page flex flex-col mx-auto px-2 sm:px-0">
			{#if isboardDataLoading}
				<div class="min-h-screen flex items-center justify-center -mt-20">
					<Spinner currentFill="#ef562f" />
				</div>
			{:else}
				<title>{`${boardData.name ?? ''} | Krello`}</title>
				<header class="flex my-4 gap-x-4 container mx-auto">
					<BoardPrivacy />
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
{/if}

<style>
	.board-page {
		height: calc(100vh - 4rem);
	}
</style>
