<script lang="ts">
	import Login from '$components/Auth/Login.component.svelte';
	import AuthForm from '$components/Auth/AuthForm.component.svelte';
	import TEXT from '$constants/text.constants';
	import ROUTES from '$constants/routes.constants';

	const { DESCRIPTION, TITLE } = TEXT.LOGIN_PAGE;
</script>

<title>Login | Krello</title>
<main class="flex items-center justify-center m-auto min-h-screen">
	<AuthForm description={DESCRIPTION} title={TITLE}>
		<Login />
		<p slot="footer-link">
			Don't have an account?
			<a href={ROUTES.REGISTER} class="text-primary-700">Create Now</a>
		</p>
	</AuthForm>
</main>
