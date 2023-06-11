<script lang="ts">
	import Icon from '@iconify/svelte';
	import Dropdown from './common/Dropdown/Dropdown.component.svelte';
	import { Button, Spinner, Tooltip } from 'flowbite-svelte';
	import { updateBoardPrivacy } from '$lib/api/appwrite/boards.api';
	import type { Board } from '$lib/types/board';
	import { authStore } from '$lib/store';
	import type { UserDetails } from '$lib/types/authStore';
	import classNames from 'classnames';
	import { Status } from '$lib/enums/Status.enums';
	import toast from 'svelte-french-toast';
	import boardStore from '$lib/store/boards.store';

	let boardData: Board;

	boardStore.subscribe((store) => {
		boardData = store.currentBoard as Board;
	});

	const isAnonymous: boolean = $authStore.isAnonymous;
	const currentUser: UserDetails = $authStore.userDetails;

	let isDropdownOpen = false;
	const toggleDropdown = (): void => {
		if (isAnonymous) return;
		if (boardData.owner.id !== currentUser.id) return;
		isDropdownOpen = !isDropdownOpen;
	};

	const PUBLIC = 'public';
	const PRIVATE = 'private';

	let updatingPrivacy = Status.IDLE;
	let settingNewPrivacyTo: null | string;

	const updatePrivacy = async (e: Event): Promise<void> => {
		updatingPrivacy = Status.LOADING;

		try {
			const target = e.currentTarget as HTMLLIElement;
			const newPrivacy = target.getAttribute('data-privacy');
			settingNewPrivacyTo = newPrivacy;
			if (newPrivacy === PUBLIC && boardData.isPrivate) {
				await updateBoardPrivacy(boardData, false);
			}

			if (newPrivacy === PRIVATE && !boardData.isPrivate) {
				await updateBoardPrivacy(boardData, true);
			}

			updatingPrivacy = Status.DONE;
			settingNewPrivacyTo = null;

			// update the store.
			boardStore.update((prevStore) => {
				if (prevStore.currentBoard) {
					prevStore.currentBoard.isPrivate = newPrivacy === PRIVATE;
				}
				return prevStore;
			});
			// close dropdown
			isDropdownOpen = false;
			toast.success(`This Board is now ${newPrivacy}`);
		} catch (error: any) {
			console.log(error);
		}
	};
</script>

<Dropdown bind:isDropdownOpen>
	<Button
		slot="action"
		color="light"
		id="privacy-btn"
		on:click={toggleDropdown}
		disabled={isAnonymous ||
			boardData.owner.id !== currentUser.id ||
			updatingPrivacy === Status.LOADING}
	>
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

	<div slot="dropdown" class="bg-white rounded-lg mt-2 border-2 p-4">
		<strong>Visibility</strong>
		<p class="text-sm">Choose who can see this board</p>

		<ul class="mt-4 flex flex-col gap-4">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				on:click|stopPropagation={updatePrivacy}
				data-privacy={PUBLIC}
				class={classNames({
					'bg-orange-100': !boardData.isPrivate,
					'cursor-pointer rounded-lg px-3 py-3': true,
					'hover:bg-gray-100': boardData.isPrivate,
				})}
			>
				{#if updatingPrivacy === Status.LOADING && settingNewPrivacyTo === PUBLIC}
					<div class="flex items-center gap-2">
						<span>
							<Spinner size="4" color="gray" />
						</span>
						<span> Updating.... </span>
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<span>
							<Icon icon="material-symbols:public" />
						</span>
						<span> Public </span>
					</div>
				{/if}
				<p class="text-xs">Anyone on the internet can see this.</p>
			</li>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				on:click|stopPropagation={updatePrivacy}
				data-privacy={PRIVATE}
				class={classNames({
					'bg-orange-100': boardData.isPrivate,
					'cursor-pointer rounded-lg px-3 py-3': true,
					'hover:bg-gray-100': !boardData.isPrivate,
				})}
			>
				{#if updatingPrivacy === Status.LOADING && settingNewPrivacyTo === PRIVATE}
					<div class="flex items-center gap-2">
						<span>
							<Spinner size="4" color="gray" />
						</span>
						<span> Updating.... </span>
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<span>
							<Icon icon="material-symbols:lock" />
						</span>
						<span> Private </span>
					</div>
				{/if}
				<p class="text-xs">Only board members can see this.</p>
			</li>
		</ul>
	</div>
</Dropdown>

{#if isAnonymous}
	<Tooltip>Anonymous users can only create public boards</Tooltip>
{/if}
