<script lang="ts">
	import ROUTES from '$constants/routes.constants';
	import logo from '$lib/logos/krello-logo.svg';
	import Icon from '@iconify/svelte';
	import {
		Navbar,
		NavBrand,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Button,
		Popover,
	} from 'flowbite-svelte';
	import { Search } from 'flowbite-svelte';
	import { Banner } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { getNavType } from '$utils/getNavType.utils';
	import { handleSignout } from '$api/appwrite/auth';
	import { authStore } from '$lib/store';
	import type { AuthState } from '$types/authStore';
	import { onDestroy } from 'svelte';

	$: navType = getNavType($page.route.id as string);

	let displayPictureURL: string;
	const unsubscribe = authStore.subscribe((authStore: AuthState) => {
		displayPictureURL = authStore.userDetails?.displayPicture ?? '';
	});

	onDestroy(unsubscribe);

	const boardName = 'Some really really long board name';

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

<Navbar class="items-center border-b-2 h-[4rem]" id="navbar">
	<NavBrand href={ROUTES.HOME}>
		<img src={logo} class="mr-3 h-6 sm:h-9" alt="Krello Logo" />
	</NavBrand>

	{#if navType === 'full'}
		<div class="hidden lg:flex gap-x-4 items-center ml-12">
			<p id="board-name" class="truncate max-w-[200px]">{boardName}</p>
			<span>|</span>
			<Button color="light">
				<div class="flex gap-x-2 items-center">
					<Icon icon="iconamoon:apps" />
					<span> All Boards </span>
				</div>
			</Button>
			<Popover placement="bottom" class="text-sm font-light " triggeredBy="#board-name">
				{boardName}
			</Popover>
		</div>
	{/if}

	{#if navType === 'full'}
		<div class="hidden md:flex search ml-auto mr-8">
			<Search size="md" on:input={handleSearch}>
				<Button size="xs">Search</Button>
			</Search>
		</div>
	{/if}

	<div>
		<div class="flex items-center md:order-2 gap-x-2 cursor-pointer" id="avatar-menu">
			<Avatar size="md" src={displayPictureURL} rounded border />
			<p class="truncate hidden md:flexs max-w-[140px]">{$authStore.userDetails.name}</p>
			<Icon icon="mdi:caret-down" />
		</div>
		<Dropdown
			class="border border-2 w-[150px] rounded-lg"
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
</Navbar>
