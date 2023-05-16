<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Navigation from '$components/Navigation/Navigation.component.svelte';
	import { AUTH_ROUTES } from '$constants/routes.constants';
	import { authStore } from '$store';
	import { redirect } from '@sveltejs/kit';

	export let fallback = AUTH_ROUTES.LOGIN;

	let isAuthenticated = false;
	authStore.subscribe((auth) => {
		isAuthenticated = auth.isAuthenticated;
		if (!auth.isAuthenticated && browser) {
			goto(fallback);
		} else if (!auth.isAuthenticated) {
			redirect(303, fallback);
		}
	});
</script>

{#if isAuthenticated}
	<Navigation />
	<slot />
{/if}
