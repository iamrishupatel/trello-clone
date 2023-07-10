<script>
	import ROUTES from '$lib/constants/routes.constants';
	import logo from '$lib/logos/krello-logo-full.svg';
</script>

<header class="relative">
	<nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
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
