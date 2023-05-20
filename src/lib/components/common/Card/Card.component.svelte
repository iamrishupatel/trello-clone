<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import CardAvatars from './CardAvatars.component.svelte';
	import type { CardLabel, CardUserData } from '$types/card';

	export let cardTitle = '';
	export let labels: CardLabel[] = [];
	export let thumbnailURL = '';
	export let users: CardUserData[] = [];
</script>

<article class="p-4 shadow flex flex-col gap-y-4 rounded-xl w-80">
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

	<!-- LABELS -->
	{#if labels.length}
		<div class="flex gap-2 flex-wrap">
			{#each labels as label}
				<Badge color={label.color}>{label.text}</Badge>
			{/each}
		</div>
	{/if}

	{#if users?.length > 0}
		<div class="pl-4">
			<CardAvatars {users} />
		</div>
	{/if}
</article>

<style lang="scss">
	.shadow {
		box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
		background: #fff;
	}
</style>
