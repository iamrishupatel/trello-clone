<script lang="ts">
	import classnames from 'classnames';
	import { onDestroy, onMount } from 'svelte';

	export let isDropdownOpen: boolean;
	export let dropdownClass = '';
	export let placement: 'left' | 'right' = 'right';

	let dropdownEl: HTMLDivElement;

	function handleClick(event: Event): void {
		const target = event.target as HTMLElement;
		if (dropdownEl && !dropdownEl.contains(target)) {
			isDropdownOpen = false;
		}
	}

	let placementClass = `placement-${placement}`;

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
			placementClass,
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
		z-index: 20;
		width: max-content;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
	}

	.placement-right {
		top: 100%;
		right: 0;
	}

	.placement-left {
		top: 100%;
		left: 0;
	}

	.dropDownWrapper.active {
		grid-template-rows: 1fr;
	}

	.dropdown {
		min-height: 0;
	}
</style>
