<script>
	import ROUTES from '$lib/constants/routes.constants';
	import logo from '$lib/logos/krello-logo-full.svg';
</script>

<header class="relative">
	<div
		class="fixed inset-0 h-10 z-50 flex items-center justify-center gap-x-6 bg-gray-900 px-6 py-2.5 sm:px-3.5"
	>
		<p class="leading-6 text-xs sm:text-base text-white">🏆 Winner Appwrite X Hashnode Hackathon</p>
	</div>

	<nav class="mt-10 flex items-center justify-between p-6 lg:px-8" aria-label="Global">
		<div class="flex lg:flex-1">
			<a href={ROUTES.HOME} class="-m-1.5 p-1.5">
				<span class="sr-only">Krello</span>
				<img class="h-8 w-auto" src={logo} alt="krelll-logo" />
			</a>
		</div>

		<div class="lg:flex lg:flex-1 lg:justify-end">
			<a href={ROUTES.LOGIN} class="text-sm font-semibold leading-6 text-gray-900"
				>Log in <span aria-hidden="true">&rarr;</span></a
			>
		</div>
	</nav>
</header>
