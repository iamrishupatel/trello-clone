<script lang="ts">
	import ROUTES from '$lib/constants/routes.constants';
	import Header from '$components/Landing/Header.component.svelte';
	import Hero from '$components/Landing/Hero.component.svelte';
	import Techused from '$components/Landing/Techused.component.svelte';
	import Features from '$components/Landing/Features.component.svelte';
	import Faq from '$components/Landing/Faq.component.svelte';
	import Footer from '$components/Landing/Footer.component.svelte';
	import { authStore } from '$lib/store';
	import type { AuthState } from '$lib/types/authStore';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isAuthenticated: boolean;

	const unsubscribe = authStore.subscribe((store: AuthState) => {
		isAuthenticated = store.isAuthenticated;
	});

	onMount(() => {
		if (isAuthenticated) {
			goto(ROUTES.HOME);
		}
	});

	onDestroy(unsubscribe);
</script>

<div class="bg-white">
	<Header />

	<main class="isolate">
		<Hero />
		<Techused />
		<Features />
		<Faq />

		<div class="bg-white">
			<div class="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
				<div
					class="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16"
				>
					<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Take Control of Your Projects. <br /> Embrace Efficiency Today.
					</h2>
					<p class="mx-auto mt-6 max-w-xl text-sm leading-8 text-gray-300">
						Boost your productivity. Start using our app today.
					</p>
					<div class="mt-10 flex items-center justify-center gap-x-6">
						<a
							href={ROUTES.REGISTER}
							class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
							>Get started</a
						>
					</div>

					<svg
						viewBox="0 0 1024 1024"
						class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
						aria-hidden="true"
					>
						<circle
							cx="512"
							cy="512"
							r="512"
							fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
							fill-opacity="0.7"
						/>
						<defs>
							<radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
								<stop stop-color="#ffd5cc" />
								<stop offset="1" stop-color="#d3330a" />
							</radialGradient>
						</defs>
					</svg>
				</div>
			</div>
		</div>
	</main>

	<Footer />
</div>
