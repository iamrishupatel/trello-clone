<script lang="ts">
	type Label = {
		text: string;
		id: string;
		color: string;
	};

	import { Badge } from 'flowbite-svelte';
	import CardAvatars from './CardAvatars.component.svelte';

	export let cardTitle = '';
	export let labels: Label[] = [];
	export let thumbnailURL = '';
	export let users: any = [];
	export let showOwnerBadge = false;
</script>

<article class="my-card p-4 shadow flex flex-col gap-y-4 rounded-xl w-80 my-8">
	<!-- IMAGE -->
	{#if thumbnailURL}
		<img src={thumbnailURL} alt="" class="h-48 w-full rounded-xl object-cover" />
	{/if}

	<!-- TITLE -->
	{#if cardTitle}
		<h5 class="textxl font-bold tracking-tight text-gray-900 dark:text-white break-all">
			{cardTitle}
		</h5>
	{/if}

	{#if showOwnerBadge}
		<div>
			<Badge>Your Board</Badge>
		</div>
	{/if}

	<!-- LABELS -->
	{#if labels.length}
		<div class="flex gap-2 flex-wrap">
			{#each labels as label}
				<Badge>{label.text}</Badge>
			{/each}
		</div>
	{/if}

	<div class="pl-4">
		<CardAvatars {users} />
	</div>
</article>

<style lang="scss">
	.shadow {
		box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
		background: #fff;
	}
</style>
