<script>
	import AuthGuard from '$components/Auth/AuthGuard.component.svelte';
</script>

<AuthGuard>
	<div class="wrapper">
		<slot />
	</div>
</AuthGuard>

<style lang="scss">
	.wrapper {
		display: grid;
		place-items: center;
		min-height: calc(100vh - 4rem);
		padding: 2rem 0;

		@media screen and (max-width: 767px) {
			display: block;
			background-color: #fff;
		}
	}
</style>
