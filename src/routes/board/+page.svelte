<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import ROUTES from '$lib/constants/routes.constants';
	export let data: PageData;

	let count = 3;
	let intervalId: any;

	onMount(() => {
		intervalId = setInterval(() => {
			count = count - 1;
			if (count === 0) {
				goto(ROUTES.HOME);
				clearTimeout(intervalId);
			}
		}, 1000);
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<title>Join Team | Krello</title>

<main class="flex flex-col items-center justify-center gap-6 h-screen min-h-[900px]">
	{#if data.hasJoinedTeam}
		<div class="flex flex-col items-center justify-center gap-2">
			<p>You have joined the team</p>
			<p>Redirecting in {count}...</p>
		</div>
	{/if}
</main>
