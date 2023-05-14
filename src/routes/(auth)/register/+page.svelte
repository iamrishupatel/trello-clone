<script lang="ts">
	import AuthForm from '$components/Auth/AuthForm.component.svelte';
	import Register from '$components/Auth/Register.component.svelte';
	import ROUTES from '$constants/routes.constants';
	import TEXT from '$constants/text.constants';

	const { DESCRITION, TITLE } = TEXT.REGISTER_PAGE;
</script>

<title>Register | Create New Account</title>

<main class="flex items-center justify-center m-auto min-h-screen">
	<AuthForm title={TITLE} description={DESCRITION}>
		<Register />
		<p slot="footer-link">
			Already a member?
			<a href={ROUTES.LOGIN} class="text-primary-700">Log in</a>
		</p>
	</AuthForm>
</main>
