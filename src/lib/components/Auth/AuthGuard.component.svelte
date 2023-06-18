<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Navigation from '$components/Navigation/Navigation.component.svelte';
	import { AUTH_ROUTES } from '$constants/routes.constants';
	import { APP_CONFIG_CONTEXT_KEY } from '$lib/constants/app.constans';
	import { authStore } from '$store';
	import { redirect } from '@sveltejs/kit';
	import { onDestroy, setContext } from 'svelte';

	export let fallback = AUTH_ROUTES.LOGIN;
	export let showBoardNameInNav = false;
	export let showSearch = false;

	let isAuthenticated = false;
	const unsub = authStore.subscribe((auth) => {
		isAuthenticated = auth.isAuthenticated;
		if (!auth.isAuthenticated && browser) {
			goto(fallback);
		} else if (!auth.isAuthenticated) {
			redirect(303, fallback);
		}
	});

	onDestroy(unsub);

	setContext(APP_CONFIG_CONTEXT_KEY, {
		showBoardNameInNav,
		showSearch,
	});
</script>

{#if isAuthenticated}
	<Navigation />
	<slot />
{/if}
