<script lang="ts">
	// import { createNewTask } from '$lib/api/appwrite/tasks.api';
	import boardStore from '$lib/store/boards.store';
	import type { Board } from '$types/board';
	import Icon from '@iconify/svelte';
	import { Button } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	let currentBoard: Board;

	const unsub = boardStore.subscribe((store) => {
		if (store.currentBoard) {
			currentBoard = store.currentBoard;
		}
	});

	onDestroy(unsub);

	const handleClick = (): void => {
		console.log(currentBoard);
		// createNewTask(currentBoard.id, );
	};
</script>

<Button class="ml-auto" on:click={handleClick}>
	<Icon icon="material-symbols:add" />
	<span class="ml-2"> Add new card </span>
</Button>
