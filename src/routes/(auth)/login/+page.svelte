<script lang="ts">
	import Login from '$components/Auth/Login.component.svelte';
	import AuthForm from '$components/Auth/AuthForm.component.svelte';
	import TEXT from '$constants/text.constants';
	import ROUTES from '$constants/routes.constants';
	import type { PageData } from './$types';

	export let data: PageData;
	let isComingFromResetPassword = data.isComingFromResetPassword;

	const { DESCRIPTION, TITLE } = TEXT.LOGIN_PAGE;
</script>

<title>Login | Krello</title>
<main class="flex items-center justify-center m-auto min-h-screen bg-white md:bg-transparent">
	<div>
		{#if isComingFromResetPassword}
			<div
				class="mb-2 border text-center border-green-500 text-green-500 font-medium py-2 px-4 rounded-lg"
			>
				<span class="font-medium">Password changed successfully! </span> <br /> Please login to continue.
			</div>
		{/if}
		<AuthForm description={DESCRIPTION} title={TITLE}>
			<Login />
			<p slot="footer-link">
				Don't have an account?
				<a href={ROUTES.REGISTER} class="text-primary-700">Create Now</a>
			</p>
		</AuthForm>
	</div>
</main>
