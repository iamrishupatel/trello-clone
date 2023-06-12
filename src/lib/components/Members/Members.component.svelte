<script lang="ts">
	import boardStore from '$lib/store/boards.store';
	import type { Board } from '$lib/types/board';
	import { Avatar } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';

	export let boardData: Board;

	let currentBoard: Board = boardData;

	const unsub = boardStore.subscribe((store) => {
		currentBoard = store.currentBoard as Board;
	});

	$: maxUsers = currentBoard.members.slice(0, 4);
	onDestroy(unsub);
</script>

{#if currentBoard.isPrivate}
	<div class="flex items-center gap-4">
		{#each maxUsers as user}
			<Avatar src={user.displayPicture} rounded />
		{/each}

		{#if Math.max(currentBoard.members.length - maxUsers.length)}
			<p class="text-slate-600 text-xs">
				+{Math.max(currentBoard.members.length - maxUsers.length)} others
			</p>
		{/if}
	</div>
{/if}
