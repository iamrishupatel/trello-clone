<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, Button, Fileupload, Helper, Spinner } from 'flowbite-svelte';
	import { Label, Input, Textarea } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import type { EditProfileValues } from '$types/formValues';
	import { authStore } from '$lib/store';
	import { updateUserDetails } from '$api/appwrite/userDetails.api';
	import { editProfileValidation } from '$lib/validations/auth.validations';

	const initialValues: EditProfileValues = {
		bio: $authStore.userDetails.bio,
		displayPicture: null,
		email: $authStore.userDetails.email,
		name: $authStore.userDetails.name,
		phone: $authStore.userDetails.phone,
		id: $authStore.userDetails.id,
	};

	$: avatarSrc = $authStore.userDetails.displayPicture;

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues,
		validationSchema: editProfileValidation,
		onSubmit: updateUserDetails,
	});

	const handleFileChange = (e: any): void => {
		const file = e.target?.files[0];

		if (file) {
			const reader = new FileReader();
			reader.addEventListener('load', function () {
				avatarSrc = reader.result?.toString() as string;
			});
			reader.readAsDataURL(file);

			form.set({
				...$form,
				displayPicture: file,
			});
		}
	};
</script>

<form on:submit={handleSubmit} class="py-8 px-4 md:px-16 flex flex-col gap-y-6">
	<div>
		<Label for="photo" class="mb-2">Photo</Label>
		<div class="flex items-center gap-x-8">
			<Avatar alt={$form.name} border src={avatarSrc} size="lg" rounded id="photo" />
			<div>
				<Fileupload class="mb-2" name="displayPicture" size="sm" on:change={handleFileChange} />
			</div>
		</div>
	</div>

	<div>
		<Label for="name" class="mb-1">Name</Label>
		<Input
			type="text"
			id="name"
			name="name"
			placeholder="Enter your name"
			bind:value={$form.name}
			on:change={handleChange}
			color={$errors.name ? 'red' : 'base'}
		>
			<Icon slot="left" icon="mdi:user" />
		</Input>
		{#if $errors.name}
			<Helper class="mt-2" color="red"><span class="font-medium">{$errors.name}</span></Helper>
		{/if}
	</div>

	<div>
		<Label for="bio" class="mb-1">
			Bio
			<span class="text-xs">(max 256 character)</span>
		</Label>
		<Textarea
			type="text"
			rows="5"
			id="bio"
			name="bio"
			placeholder="Tell us something about you!"
			bind:value={$form.bio}
			on:change={onchange}
			class={$errors.bio
				? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400'
				: ''}
		/>
		{#if $errors.bio}
			<Helper class="mt-2" color="red"><span class="font-medium">{$errors.bio}</span></Helper>
		{/if}
	</div>

	<div>
		<Label for="phone" class="mb-1">Phone</Label>
		<Input
			type="tel"
			id="phone"
			name="phone"
			placeholder="Enter your phone number"
			bind:value={$form.phone}
			on:change={handleChange}
			color={$errors.phone ? 'red' : 'base'}
			disabled
		>
			<Icon slot="left" icon="material-symbols:phone-android-outline-rounded" />
		</Input>
		<Helper class="mt-2"
			><span class="font-medium">Disabled for sometime. Will be enabled later</span></Helper
		>

		{#if $errors.phone}
			<Helper class="mt-2" color="red"><span class="font-medium">{$errors.phone}</span></Helper>
		{/if}
	</div>

	<div>
		<Label for="email" class="mb-1">Email</Label>
		<Input
			type="email"
			id="email"
			disabled
			bind:value={$form.email}
			color={$errors.email ? 'red' : 'base'}
		>
			<Icon slot="left" icon="ic:baseline-email" />
		</Input>
		{#if $errors.email}
			<Helper class="mt-2" color="red"><span class="font-medium">{$errors.email}</span></Helper>
		{/if}
	</div>

	<div>
		<Button type="submit" disabled={$isSubmitting}>
			{#if $isSubmitting}
				<Spinner class="mr-3" size="4" color="white" />Submitting...
			{:else}
				Submit
			{/if}
		</Button>
	</div>
</form>
