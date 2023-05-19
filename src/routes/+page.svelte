<script lang="ts">
	import AuthGuard from '$components/Auth/AuthGuard.component.svelte';
	import CreateBoard from '$components/CreateBoard.component.svelte';
	import Card from '$components/common/Card/Card.component.svelte';
	import { Button } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import boardStore from '$lib/store/boards.store';
	import { authStore } from '$lib/store';
	import type { AuthState, UserDetails } from '$types/authStore';

	export let data: PageData;
	let boards = data.boards;

	let isModalOpen = false;

	const openModel = (): void => {
		isModalOpen = true;
	};

	let userDetail: UserDetails | null;

	boardStore.subscribe((boardsData) => {
		boards = boardsData.boards;
		isModalOpen = boardsData.isCreateBoardModalOpen;
	});

	authStore.subscribe((auth: AuthState) => {
		userDetail = auth.userDetails;
	});
</script>

<title>All Boards | Krello</title>

<AuthGuard>
	<main class="container mx-auto flex flex-col pt-12">
		<div class="">
			<header class="flex items-center justify-between gap-2 px-4">
				<h1 class="text-xl md:text-2xl font-bold">All Boards</h1>
				<Button on:click={openModel}>New</Button>
			</header>

			<section class="cards mt-8">
				{#each boards as board}
					<Card
						cardTitle={board.name}
						thumbnailURL={board.coverURL}
						users={board.members}
						showOwnerBadge={board.owner === userDetail?.id}
					/>
				{/each}
			</section>
		</div>

		<!-- CREATE NEW BOARD FORM MODAL -->
		<CreateBoard bind:isModalOpen />
	</main>
</AuthGuard>

<style lang="scss">
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
		justify-items: center;

		@media screen and (max-width: 350px) {
			grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		}
	}
</style>
