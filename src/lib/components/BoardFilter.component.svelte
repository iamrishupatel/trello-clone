<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button, Checkbox, Indicator } from 'flowbite-svelte';
	import { authStore } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import { BoardFilterOption } from '$lib/enums/App.enums';
	import Dropdown from './common/Dropdown/Dropdown.component.svelte';

	let isDropdownOpen = false;
	let isAnonymous = $authStore.isAnonymous;
	const dispatch = createEventDispatcher();

	const hanldeDropdownToggle = (): void => {
		isDropdownOpen = !isDropdownOpen;
	};

	let filterValues: string[] = [];

	const hanldeChange = (e: Event): void => {
		const { nodeName } = e.target as HTMLInputElement;
		if (nodeName === 'INPUT') {
			dispatch('change', filterValues);
		}
	};
</script>

<Dropdown bind:isDropdownOpen dropdownClass="mt-2 ">
	<Button
		slot="action"
		on:click={hanldeDropdownToggle}
		outline={true}
		color="light"
		class="!px-3"
		size="lg"
	>
		<Icon icon="solar:filter-bold" />
		{#if filterValues.length > 0}
			<Indicator color="red" border size="xl" placement="top-right">
				<span class="text-white text-xs font-bold">{filterValues.length}</span>
			</Indicator>
		{/if}
	</Button>

	<ul
		on:change={hanldeChange}
		slot="dropdown"
		class="bg-white border-2 rounded-lg p-2 flex flex-col gap-2 shadow-2xl"
	>
		<li>
			<Checkbox color="orange" bind:group={filterValues} value={BoardFilterOption.ALL_BOARDS}
				>All Boards</Checkbox
			>
		</li>
		<li>
			<Checkbox color="orange" bind:group={filterValues} value={BoardFilterOption.MY_BOARDS}
				>My Boards</Checkbox
			>
		</li>
		<li>
			<Checkbox color="orange" bind:group={filterValues} value={BoardFilterOption.PUBLIC}
				>Public Boards</Checkbox
			>
		</li>
		{#if !isAnonymous}
			<li id="private">
				<Checkbox
					color="orange"
					bind:group={filterValues}
					value={BoardFilterOption.PRIVATE}
					disabled={isAnonymous}>Private Boards</Checkbox
				>
			</li>
		{/if}
	</ul>
</Dropdown>
