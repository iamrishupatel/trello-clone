<script lang="ts">
	import { authStore } from '$lib/store';
	import { initialAuthStore } from '$lib/store/auth.store';
	import type { AuthState } from '$types/authStore';
	import Icon from '@iconify/svelte';
	import '../app.postcss';

	import { Toast } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	let authErr: string | null;
	let showToast = false;
	let timeoutId: ReturnType<typeof setTimeout> | null;

	authStore.subscribe((auth: AuthState) => {
		authErr = auth.authErrorMessage;
	});

	$: {
		showToast = Boolean(authErr);
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		if (authErr) {
			timeoutId = setTimeout(() => {
				showToast = false;
				authStore.set(initialAuthStore);
			}, 5000);
		}
	}

	onDestroy(() => {
		if (timeoutId) clearTimeout(timeoutId);
	});
</script>

<slot />

<!-- AUTH ERROR MESSAGES -->
{#if authErr || false}
	<Toast
		simple
		color="red"
		transition={slide}
		bind:open={showToast}
		position="top-right"
		class="text-xs"
	>
		<svelte:fragment slot="icon">
			<Icon icon="material-symbols:error" class="text-red-600 text-xl" />
		</svelte:fragment>
		{authErr}
	</Toast>
{/if}

<!-- ^ ABOVE LOGIC COULD BE REMOVED -->
<!-- TOASTER FOR NOTIFICATIONS -->
<Toaster />

<style lang="scss">
	@use '$lib/sass/global.scss';
</style>
