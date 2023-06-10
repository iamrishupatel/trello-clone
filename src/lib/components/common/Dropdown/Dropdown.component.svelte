<script lang="ts">
	import classnames from 'classnames';
	import { onDestroy, onMount } from 'svelte';

	export let isDropdownOpen: boolean;
	export let dropdownClass = '';

	let dropdownEl: HTMLDivElement;

	function handleClick(event: Event): void {
		const target = event.target as HTMLElement;
		if (dropdownEl && !dropdownEl.contains(target)) {
			isDropdownOpen = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', handleClick);
	});

	onDestroy(() => {
		window.removeEventListener('click', handleClick);
	});
</script>

<div class="relative" bind:this={dropdownEl}>
	<slot name="action" />
	<div
		class={classnames({
			dropDownWrapper: true,
			active: isDropdownOpen,
		})}
	>
		<div class={classnames('dropdown', dropdownClass)}>
			<slot name="dropdown" />
		</div>
	</div>
</div>

<style lang="scss">
	.dropDownWrapper {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		transition: grid-template-rows 200ms;
		position: absolute;
		top: 100%;
		z-index: 20;
		right: 0;
		width: max-content;
	}

	.dropDownWrapper.active {
		grid-template-rows: 1fr;
	}

	.dropdown {
		min-height: 0;
	}
</style>
