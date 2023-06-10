<script lang="ts">
	import AuthGuard from '$components/Auth/AuthGuard.component.svelte';
	import CreateBoard from '$components/CreateBoard.component.svelte';
	import Card from '$components/common/Card/Card.component.svelte';
	import { Button } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import boardStore from '$lib/store/boards.store';
	import Masonry from '$components/Layouts/Masonry.component.svelte';
	import BoardFilter from '$components/BoardFilter.component.svelte';
	import { onDestroy } from 'svelte';

	export let data: PageData;
	let boards = data.boards;
	$: filteredBoards = data.boards;

	let isModalOpen = false;

	const openModel = (): void => {
		isModalOpen = true;
	};

	const unsub = boardStore.subscribe((boardsData) => {
		boards = boardsData.boards;
		isModalOpen = boardsData.isCreateBoardModalOpen;
	});

	onDestroy(unsub);

	const hanldeApplyFilter = (e: CustomEvent): void => {
		const filterValues: string[] = e.detail;
		console.log(filterValues);
	};
</script>

<title>All Boards | Krello</title>

<AuthGuard>
	<main class="container mx-auto flex flex-col pt-12">
		<div class="">
			<header class="flex items-center justify-between gap-2 px-4">
				<h1 class="text-xl md:text-2xl font-bold">All Boards</h1>
				<div class="flex items-center gap-x-2">
					<BoardFilter on:change={hanldeApplyFilter} />
					<Button on:click={openModel}>New</Button>
				</div>
			</header>

			<section class="mt-8">
				<Masonry gridGap={'1rem'} colWidth={'minmax(Min(22rem, 100%), 1fr)'} items={boards}>
					{#each filteredBoards as board}
						<div>
							<Card
								cardTitle={board.name}
								thumbnailURL={board.coverURL}
								users={board.members}
								labels={board.labels}
								href={`/board/${board.id}`}
							/>
						</div>
					{/each}
				</Masonry>
			</section>
		</div>

		<!-- CREATE NEW BOARD FORM MODAL -->
		<CreateBoard bind:isModalOpen />
	</main>
</AuthGuard>
