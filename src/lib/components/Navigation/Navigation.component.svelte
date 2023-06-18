<script lang="ts">
	import ROUTES from '$constants/routes.constants';
	import logo from '$lib/logos/krello-logo-full.svg';
	import Icon from '@iconify/svelte';
	import {
		NavBrand,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Button,
		Popover,
	} from 'flowbite-svelte';
	import { Search, Banner } from 'flowbite-svelte';
	import { handleSignout } from '$api/appwrite/auth';
	import { authStore } from '$lib/store';
	import type { AuthState } from '$types/authStore';
	import { getContext, onDestroy } from 'svelte';
	import { APP_CONFIG_CONTEXT_KEY } from '$lib/constants/app.constans';
	import type { AppConfigContext } from '$lib/types/context.types';
	import boardStore from '$lib/store/boards.store';

	const { showBoardNameInNav, showSearch } = getContext(APP_CONFIG_CONTEXT_KEY) as AppConfigContext;

	let displayPictureURL: string;
	const unsubscribe = authStore.subscribe((authStore: AuthState) => {
		displayPictureURL = authStore.userDetails?.displayPicture ?? '';
	});

	let currentBoardName: string;
	const unsubFromBoardStore = boardStore.subscribe((store) => {
		currentBoardName = store.currentBoard?.name ?? '';
	});

	onDestroy(() => {
		unsubFromBoardStore();
		unsubscribe();
	});

	const handleSearch = (e: Event): void => {
		console.log(e);
	};

	const signout = (): void => {
		handleSignout($authStore.sessionId);
	};
</script>

<div class="md:hidden">
	<Banner id="default-banner">
		<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
			<span class="inline-flex p-1 mr-3 bg-gray-200 rounded-full dark:bg-gray-600">
				<Icon icon="mdi:lightbulb-on-outline" />
				<span class="sr-only">Light bulb</span>
			</span>
			<span class="text-xs"> For better eperience view in desktop</span>
		</p>
	</Banner>
</div>

<nav class="px-4 md:px-10 flex items-center border-b-2 h-[4rem]" id="navbar">
	<NavBrand href={ROUTES.HOME}>
		<img src={logo} class="mr-3 h-6 sm:h-9" alt="Krello Logo" />
	</NavBrand>

	{#if showBoardNameInNav && currentBoardName}
		<div class="hidden lg:flex gap-x-4 items-center ml-12">
			<p id="board-name" class="truncate max-w-[200px]">
				{currentBoardName}
			</p>

			<span>|</span>
			<a href={ROUTES.HOME}>
				<Button color="light">
					<div class="flex gap-x-1 items-center">
						<Icon icon="material-symbols:call-to-action-rounded" />
						<span> All Boards </span>
					</div>
				</Button>
			</a>
			{#if currentBoardName.length > 17}
				<Popover placement="bottom" class="text-sm font-light " triggeredBy="#board-name">
					{currentBoardName}
				</Popover>
			{/if}
		</div>
	{:else if showBoardNameInNav}
		<div class="hidden lg:block animate-pulse w-64 ml-12 bg-slate-200 h-8 rounded" />
	{/if}

	{#if showSearch}
		<div class="hidden md:flex search ml-auto mr-8">
			<Search size="md" on:input={handleSearch}>
				<Button size="xs">Search</Button>
			</Search>
		</div>
	{/if}

	<div class="ml-auto">
		<div class="flex items-center md:order-2 gap-x-2 cursor-pointer" id="avatar-menu">
			<Avatar size="md" src={displayPictureURL} rounded />
			<p class="truncate hidden md:flexs max-w-[140px]">{$authStore.userDetails.name}</p>
			<Icon icon="mdi:caret-down" />
		</div>
		<Dropdown
			class="border w-[150px] rounded-lg"
			frameClass="rounded-lg"
			placement="bottom"
			triggeredBy="#avatar-menu"
		>
			<div class="p-2">
				<DropdownItem class="cursor-pointer rounded-lg hover:no-underline" href={ROUTES.MY_PROFILE}>
					<p class="flex items-center gap-x-2">
						<Icon icon="mdi:account" />
						My Profile
					</p>
				</DropdownItem>
				<DropdownDivider />
				<DropdownItem class="cursor-pointer rounded-lg" on:click={signout}>
					<p class="flex items-center gap-x-2 text-red-600">
						<Icon icon="ic:baseline-log-out" />
						Sign out
					</p>
				</DropdownItem>
			</div>
		</Dropdown>
	</div>
</nav>
