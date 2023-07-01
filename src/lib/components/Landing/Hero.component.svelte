<script>
	import ROUTES from '$lib/constants/routes.constants';
	import appScreenShot from '$lib/assets/app-screenshots/board-page.png';
</script>

<div class="relative pt-14">
	<div
		class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
		aria-hidden="true"
	>
		<div
			class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		/>
	</div>
	<div class="py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-4xl text-center">
				<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					Introducing Krello - Your goto Project management app!
				</h1>
				<p class="mt-6 text-xs sm:text-base md:text-lg sm:leading-8 text-gray-600">
					<!-- Level up project management with Krello, the ultimate Trello clone. -->
					Seamlessly collaborate, track tasks, and achieve goals effortlessly. Streamline workflow, save
					time, and take control of your projects. Experience the power of Krello now!
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					<a
						href={ROUTES.LOGIN}
						class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
						>Get started
					</a>

					<a
						href="https://blog.rishupatel.com/unleashing-productivity-introducing-krello-your-goto-project-management-app"
						target="_blank"
						class="text-sm font-semibold leading-6 text-gray-900"
						>Read Blog <span aria-hidden="true">→</span></a
					>
				</div>
			</div>
			<div class="mt-16 flow-root sm:mt-24">
				<div
					class="-m-2 bg-red-600 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4"
				>
					<img
						src={appScreenShot}
						alt="App screenshot"
						width="2432"
						height="1442"
						class="relative z-10 rounded-md shadow-2xl ring-1 ring-gray-900/10"
					/>
				</div>
			</div>
		</div>
	</div>
	<div
		class="absolute inset-x-0 top-[calc(100%-13rem)] z-1 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
		aria-hidden="true"
	>
		<div
			class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
			style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
		/>
	</div>
</div>
