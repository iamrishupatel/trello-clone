<div class="wrapper">
	<slot />
</div>

<style lang="scss">
	.wrapper {
		width: 100vw;
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
