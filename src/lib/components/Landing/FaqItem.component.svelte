<script lang="ts">
	type FaqItem = {
		question: string;
		answer: string;
	};
	export let faq: FaqItem;

	let isQuestionOpen = false;
	const toggleOpenState = (): void => {
		isQuestionOpen = !isQuestionOpen;
	};
</script>

<div class="pt-6">
	<dt>
		<button
			type="button"
			class="flex w-full items-start justify-between text-left text-gray-900"
			aria-controls="faq-0"
			aria-expanded="false"
			on:click={toggleOpenState}
		>
			<span class="text-base font-semibold leading-7">{faq.question}</span>
			{#if isQuestionOpen}
				<span class="ml-6 flex h-7 items-center">
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
					</svg>
				</span>
			{:else}
				<span class="ml-6 flex h-7 items-center">
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
					</svg>
				</span>
			{/if}
		</button>
	</dt>

	{#if isQuestionOpen}
		<dd class="mt-2 pr-12" id="faq-0">
			<p class="text-base leading-7 text-gray-600">
				{faq.answer}
			</p>
		</dd>
	{/if}
</div>
