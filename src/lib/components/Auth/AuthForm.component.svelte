<script lang="ts">
	// import SocialLogins from './SocialLogins.component.svelte';
	import AuthHeader from './AuthHeader.component.svelte';

	export let title: string;
	export let description: string;
</script>

<div class="form border">
	<AuthHeader {description} {title} />

	<slot />

	<!-- <p class="or mx-auto mt-4">OR</p> -->

	<footer class="flex flex-col items-center text-sm gap-y-4">
		<!-- <p>Continue with these social profiles</p> -->

		<!-- <SocialLogins /> -->

		<slot name="footer-link" />
	</footer>
</div>

<style lang="scss">
	.form {
		background-color: #fff;
		border: 1px solid #bdbdbd;
		max-width: 480px;
		padding: 2rem;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@media screen and (max-width: 500px) {
			padding: 2rem 1rem;
			border: none;
			width: 100%;
		}

		// .or {
		// 	$line-width: 110px;
		// 	position: relative;

		// 	&::before {
		// 		content: '';
		// 		position: absolute;
		// 		height: 1px;
		// 		width: $line-width;
		// 		background-color: #bdbdbd;
		// 		top: 50%;
		// 		right: 200%;
		// 	}

		// 	&::after {
		// 		content: '';
		// 		position: absolute;
		// 		height: 1px;
		// 		width: $line-width;
		// 		background-color: #bdbdbd;
		// 		top: 50%;
		// 		left: 200%;
		// 	}
		// }
	}
</style>
