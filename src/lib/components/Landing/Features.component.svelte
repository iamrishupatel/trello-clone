<script lang="ts">
	import { features } from '$lib/constants/app.constans';
	import Icon from '@iconify/svelte';
</script>

<div class="bg-white py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:text-center">
			<h2 class="text-xs sm:text-base font-semibold leading-7 text-primary-600">
				Project Management Made Simple.
			</h2>
			<p class="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
				Key Features of Our Project Management Solution
			</p>
		</div>
		<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
			<dl
				class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
			>
				{#each features as { title, description, icon }}
					<div class="relative pl-16">
						<dt class="text-base font-semibold leading-7 text-gray-900 whitespace-pre-line">
							<div
								class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-xl"
							>
								<Icon {icon} color="white" />
							</div>

							{title}
						</dt>
						<dd class="mt-2 text-base leading-7 text-gray-600">
							{description}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</div>
