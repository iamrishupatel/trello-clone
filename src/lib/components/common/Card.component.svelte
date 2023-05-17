<script lang="ts">
	type Label = {
		text: string;
		id: string;
		color: string;
	};

	import { Badge } from 'flowbite-svelte';
	export let cardTitle = '';
	export let labels: Label[] = [];
	export let thumbnailURL = '';
</script>

<article class="my-card p-4 shadow flex flex-col gap-y-4 rounded-xl w-80 my-8">
	<!-- IMAGE -->
	{#if thumbnailURL}
		<img src={thumbnailURL} alt="" class="h-48 w-full rounded-xl object-cover" />
	{/if}

	<!-- TITLE -->
	{#if cardTitle}
		<h5 class="mb-2 textxl font-bold tracking-tight text-gray-900 dark:text-white">
			{cardTitle}
		</h5>
	{/if}

	<!-- LABELS -->
	<div class="flex gap-2 flex-wrap">
		{#each labels as label}
			<Badge>{label.text}</Badge>
		{/each}
	</div>
</article>

<style lang="scss">
	.shadow {
		box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
		background: #fff;
	}
</style>
