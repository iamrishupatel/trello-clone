<script>
	import svelte from '$lib/assets/logos/svelte-kit-horizontal.svg';
	import appwrite from '$lib/assets/logos/built-with-appwrite.svg';
	import flowbite from '$lib/assets/logos/flowbite-logo.svg';
	import typescript from '$lib/assets/logos/TypeScript_Logo.svg';
	import quill from '$lib/assets/logos/quill.svg';
	import tailwind from '$lib/assets/logos/tailwindcss-logotype.svg';

	const images = [
		{ alt: 'svelte', src: svelte },
		{ alt: 'tailwind', src: tailwind },
		{ alt: 'appwrite', src: appwrite },
		{ alt: 'flowbite', src: flowbite },
		{ alt: 'quill', src: quill },
		{ alt: 'typescript', src: typescript },
	];
</script>

<div class="bg-white py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<h2 class="mb-12 text-center text-lg font-semibold leading-8 text-gray-900">
			Cutting-Edge Technologies: Powering the App's Development
		</h2>
		<div
			class="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3"
		>
			{#each images as { alt, src }}
				<div class="bg-primary-400/5 p-8 sm:p-10 flex items-center justify-center">
					<img
						{alt}
						{src}
						class="col-span-2 max-h-12 object-contain lg:col-span-1"
						width="158"
						height="48"
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
