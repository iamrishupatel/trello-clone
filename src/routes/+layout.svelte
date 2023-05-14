<script>
	import Navigation from '$components/Navigation/Navigation.component.svelte';
	import '../app.postcss';
</script>

<Navigation />
<slot />

<style lang="scss">
	@use '$lib/sass/global.scss';
</style>
