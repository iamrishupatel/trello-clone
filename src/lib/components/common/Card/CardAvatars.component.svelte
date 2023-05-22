<script lang="ts">
	import type { CardUserData } from '$types/card';
	import { Avatar } from 'flowbite-svelte';

	export let users: CardUserData[] = [];
	export let draggable = false;

	$: maxUsers = users.slice(0, 4);
</script>

<div class="flex items-center">
	{#each maxUsers as user}
		<Avatar
			src={user.displayPicture}
			data-name={user.name}
			stacked
			class="border border-primary-700"
			draggable={!draggable}
		/>
	{/each}

	{#if Math.max(users.length - maxUsers.length)}
		<p class="ml-4 text-slate-600 text-xs">
			+{Math.max(users.length - maxUsers.length)} others
		</p>
	{/if}
</div>
