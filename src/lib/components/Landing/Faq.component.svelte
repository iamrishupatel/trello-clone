<script lang="ts">
	import { faqs } from '$lib/constants/app.constans';
	import FaqItem from './FaqItem.component.svelte';
</script>

<div class="bg-white" id="faq">
	<div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
		<div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
			<h2 class="text-2xl sm:text-4xl font-bold leading-10 tracking-tight text-gray-900">
				Frequently asked questions
			</h2>
			<dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
				{#each faqs as faq}
					<FaqItem {faq} />
				{/each}
			</dl>
		</div>
	</div>
</div>
