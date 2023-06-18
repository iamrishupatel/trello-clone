<script lang="ts">
	import src from '$lib/logos/krello-logo-with-orange-bg.svg';

	export let title: string;
	export let description: string;
</script>

<header class="mb-2">
	<div class="flex items-center gap-x-4 mb-6">
		<img {src} alt="krello-logo" class="h-10" />

		<h1 class=" text-xl sm:text-2xl font-semibold">{title}</h1>
	</div>

	<p class="mt-2">
		{description}
	</p>
</header>
