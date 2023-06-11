<script lang="ts">
	import ROUTES from '$lib/constants/routes.constants';
	import Icon from '@iconify/svelte';
	import { Button } from 'flowbite-svelte';

	export let title = 'Krello | Trello Clone',
		errorCode = 404,
		errorTitle = 'Uh-oh!',
		errorDescription = 'We can\'t find that page.';
</script>

<title>{title}</title>

<main class="grid min-h-90 h-screen px-4 bg-white place-content-center">
	<div class="text-center">
		<h1 class="font-black text-gray-200 text-9xl">{errorCode}</h1>

		<p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">{errorTitle}</p>

		<p class="mt-4 text-gray-500">{errorDescription}</p>

		<a href={ROUTES.HOME}>
			<Button class="mt-6 flex items-center gap-x-2">
				<span><Icon icon="ion:arrow-back" /></span>
				<span> Go Back Home </span>
			</Button>
		</a>
	</div>
</main>
