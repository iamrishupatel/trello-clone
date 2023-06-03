<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import CardAvatars from './CardAvatars.component.svelte';
	import type { CardLabel, CardUserData } from '$types/card';
	import type { TaskPriority } from '$types/kanban';

	//props
	export let cardTitle = '',
		labels: CardLabel[] = [],
		thumbnailURL = '',
		users: CardUserData[] = [],
		href = '',
		draggable = false,
		priority: TaskPriority | null;
	//props end
</script>

<article class="p-4 shadow flex flex-col gap-y-4 rounded-xl w-80">
	<!-- IMAGE -->
	{#if thumbnailURL}
		<img
			src={thumbnailURL}
			alt=""
			class="h-48 w-full rounded-xl object-cover"
			draggable={!draggable}
		/>
	{/if}

	<!-- TITLE -->
	{#if cardTitle}
		<h5 class="textxl font-bold tracking-tight text-gray-900 dark:text-white break-all">
			{#if href}
				<a {href}>
					{cardTitle}
				</a>
			{:else}
				{cardTitle}
			{/if}
		</h5>
	{/if}

	<!-- LABELS -->
	{#if priority || labels.length > 0}
		<div class="flex gap-2 flex-wrap">
			{#if priority}
				<div class="flex gap-2 flex-wrap capitalize">
					<Badge color={priority.color}>{priority.text}</Badge>
				</div>
			{/if}
			{#if labels.length}
				{#each labels as label}
					<Badge color={label.color}>{label.text}</Badge>
				{/each}
			{/if}
		</div>
	{/if}

	{#if users?.length > 0}
		<div class="pl-4">
			<CardAvatars {users} {draggable} />
		</div>
	{/if}
</article>

<style lang="scss">
	.shadow {
		box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
		background: #fff;
	}
</style>
