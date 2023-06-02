<script lang="ts">
	import { AVAILABLE_LABEL_COLORS } from '$constants/app.constans';
	import { createNewLabel } from '$lib/api/appwrite/labels';
	import boardStore from '$lib/store/boards.store';
	import type { CardLabel } from '$types/card';
	import createLabelFormSchema from '$validations/createLabel.validation';
	import Icon from '@iconify/svelte';
	import { Input, Badge, Label, Radio, Spinner, Helper } from 'flowbite-svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { createForm } from 'svelte-forms-lib';

	export let selectedLabels: CardLabel[] = [];

	let availableLabels: CardLabel[] = [];
	const unsub = boardStore.subscribe((store) => {
		availableLabels = store.labels;
	});

	onDestroy(unsub);

	const dispatch = createEventDispatcher();
	const hanldeSelectLabel = (label: CardLabel): void => {
		dispatch('labelSelected', label);
	};

	const removeLabel = (label: CardLabel): void => {
		dispatch('removeLabel', label);
	};

	let isDropdownOpen = false;
	const hanldeClick = (): void => {
		isDropdownOpen = !isDropdownOpen;
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit, handleReset } = createForm({
		initialValues: {
			text: '',
			color: '',
		},
		validationSchema: createLabelFormSchema,
		onSubmit: async (values): Promise<void> => {
			await createNewLabel(values);
			handleReset();
		},
	});
</script>

<div class="relative">
	<button
		type="button"
		on:click={hanldeClick}
		class="relative border w-80 flex items-center px-3 py-2 rounded-lg z-0"
		id="bell"
	>
		{#if selectedLabels.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each selectedLabels as label}
					<Badge color={label.color} dismissable
						>{label.text}
						<svelte:fragment slot="closeBtn">
							<button
								on:click|stopPropagation={() => removeLabel(label)}
								type="button"
								class="inline-flex items-center p-0.5 ml-2 text-sm bg-transparent rounded-sm text-blue-400 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300"
								aria-label="Remove"
							>
								<Icon icon="carbon:close-filled" />
								<span class="sr-only">Remove badge</span>
							</button>
						</svelte:fragment></Badge
					>
				{/each}
			</div>
		{:else}
			<Icon icon="material-symbols:label" />
			<span class="ml-2"> Labels </span>
		{/if}
	</button>

	<div class={!isDropdownOpen ? 'dropdown' : 'dropdown  active border w-80 rounded-lg'}>
		<p class="flex items-center gap-x-2">
			<Icon icon="material-symbols:label" />
			<span class="text-sm"> Available </span>
		</p>

		<div class="flex flex-wrap gap-2">
			{#each availableLabels as label}
				<!-- FIXME: -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div on:click={() => hanldeSelectLabel(label)}>
					<Badge color={label.color} class="cursor-pointer">{label.text}</Badge>
				</div>
			{/each}
		</div>

		<form on:submit={handleSubmit}>
			<div class="">
				<Label class="font-bold flex items-center mb-2">Create new</Label>
				<Input
					placeholder="Enter new label name"
					name="text"
					bind:value={$form.text}
					on:change={handleChange}
				/>
				{#if $errors.text}
					<Helper class="mt-1" color="red"><span class="font-medium">{$errors.text}</span></Helper>
				{/if}
			</div>
			<div class="my-4">
				<div class="labels-grid">
					{#each AVAILABLE_LABEL_COLORS as color}
						<Radio custom name="color" bind:group={$form.color} value={color.value}>
							<div
								class={`flex items-center justify-center rounded cursor-pointer capitalize w-full h-10 peer-checked:border-2 peer-checked:border-blue-600 ${color.tailwindCls}`}
							>
								<span>{color.value}</span>
							</div>
						</Radio>
					{/each}
				</div>
				{#if $errors.color}
					<Helper class="mt-1" color="red"><span class="font-medium">{$errors.color}</span></Helper>
				{/if}
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={handleSubmit} class="border w-fit cursor-pointer px-3 py-2 text-sm rounded-md">
				{#if $isSubmitting}
					<Spinner class="mr-3" size="4" color="white" />Creating...
				{:else}
					Create
				{/if}
			</div>
		</form>
	</div>
</div>

<style lang="scss">
	.dropdown {
		position: absolute;
		top: 120%;
		z-index: 20;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 0;
		overflow: hidden;
		transition: 0.4s height;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
	}

	.dropdown.active {
		max-height: fit-content;
		padding: 1rem;
	}

	.labels-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
</style>
