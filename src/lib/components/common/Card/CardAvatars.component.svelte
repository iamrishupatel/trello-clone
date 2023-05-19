<script lang="ts">
	import { Avatar } from 'flowbite-svelte';

	export let users: any[] = [];
	$: maxUsers = users.slice(0, 5);
</script>

<div class="flex items-center">
	{#each maxUsers as user}
		<Avatar
			src={user.displayPicture}
			data-name={user.name}
			stacked
			class="border border-primary-700"
		/>
	{/each}
	{#if Math.max(users.length - maxUsers.length)}
		<div class="ml-4">
			+{Math.max(users.length - maxUsers.length)} others
		</div>
	{/if}
</div>
