<script lang="ts">
	import type { PageData } from './$types';
	import ResetPassword from '$components/Auth/ResetPassword.component.svelte';
	import ChangePassword from '$components/Auth/ChangePassword.component.svelte';

	export let data: PageData;
</script>

<title>Reset Password | Krello</title>

<main class="flex flex-col items-center justify-center gap-6 h-screen min-h-[900px]">
	{#if data.userId && data.secret}
		<ChangePassword userId={data.userId} secret={data.secret} />
	{:else}
		<ResetPassword />
	{/if}
</main>
