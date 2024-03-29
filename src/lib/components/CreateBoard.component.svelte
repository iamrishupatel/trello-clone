<script lang="ts">
	import { createNewBoard } from '$lib/api/appwrite/boards.api';
	import { authStore } from '$lib/store';
	import type { AuthState } from '$types/authStore';
	import type { NewBoardFormData } from '$types/board';
	import { newBoardFormSchema } from '$lib/validations/board.validations';
	import Icon from '@iconify/svelte';
	import { Button, Dropzone, Helper, Input, Label, Modal, Spinner, Toggle } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';

	export let isModalOpen = false;

	let isAnonymous: boolean;

	authStore.subscribe((auth: AuthState) => {
		isAnonymous = auth.isAnonymous;
	});

	const initialValues: NewBoardFormData = {
		file: '',
		name: '',
		isPrivate: false,
		owner: $authStore.userDetails.id,
		email: $authStore.userDetails.email,
	};

	const handleCancel = (): void => {
		src = '';
		isModalOpen = false;
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit, handleReset } = createForm({
		initialValues,
		validationSchema: newBoardFormSchema,
		onSubmit: (values): Promise<void> => createNewBoard(values, isAnonymous, handleReset),
	});

	// IMAGE PREVIEW SRC
	let src = '';

	// make src reactive to file so when form resets
	// src will be reseted as well
	$: {
		if ($form.file) {
			src = URL.createObjectURL($form.file);
		} else {
			src = '';
		}
	}

	const handleFileChange = (e: any): void => {
		const file = e.target?.files[0];

		if (file) {
			form.set({
				...$form,
				file: file,
			});
		}
	};

	const removeCover = (): void => {
		form.update((prevState: NewBoardFormData) => ({ ...prevState, file: '' }));
	};
</script>

<Modal title="Create new board" bind:open={isModalOpen}>
	<form class="flex flex-col gap-y-4 w-[500px]" on:submit|preventDefault={handleSubmit}>
		<div>
			{#if src}
				<div class="relative flex w-full h-48 rounded-lg border-2 border-gray-300 border-dashed">
					<div class="absolute -right-2 -top-2">
						<Button class="!p-2" size="xl" type="button" on:click={removeCover}
							><Icon icon="mdi:multiply" /></Button
						>
					</div>
					<img {src} alt="" class=" rounded-lg w-full object-cover" />
				</div>
			{:else}
				<Dropzone
					id="dropzone"
					on:change={handleFileChange}
					defaultClass="flex flex-col justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
				>
					<Icon class="text-3xl" icon="material-symbols:cloud-upload" />
					<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
						<span class="font-semibold">Click to upload</span> or drag and drop
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
				</Dropzone>
			{/if}
		</div>

		<div>
			<Label for="name" class="block mb-2 sr-only">Board Name</Label>
			<Input
				id="name"
				type="text"
				placeholder="Enter your board name"
				bind:value={$form.name}
				on:change={handleChange}
				color={$errors.name ? 'red' : 'base'}
			>
				<Icon icon="mdi:rename-box" slot="left" />
			</Input>
			{#if $errors.name}
				<Helper class="mt-2" color="red"><span class="font-medium">{$errors.name}</span></Helper>
			{/if}
		</div>

		<div class="w-fit">
			<Toggle
				class="cursor-pointer"
				name="isPrivate"
				id="isPrivate"
				bind:checked={$form.isPrivate}
				on:change={handleChange}
				bind:disabled={isAnonymous}>Private Board</Toggle
			>
			<Helper class="mt-2">
				{isAnonymous
					? 'Anonymous users can\'t create private boards'
					: 'By default all board are public'}
			</Helper>
		</div>

		<div class="ml-auto flex gap-x-4">
			<Button color="alternative" type="button" on:click={handleCancel}>Cancel</Button>
			<Button type="submit" disabled={$isSubmitting}>
				{#if $isSubmitting}
					<Spinner class="mr-3" size="4" color="white" />Creating...
				{:else}
					Create
				{/if}
			</Button>
		</div>
	</form>
	<svelte:fragment slot="footer" />
</Modal>
