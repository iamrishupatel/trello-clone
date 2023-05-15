<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, Button, Fileupload, Helper, Spinner } from 'flowbite-svelte';
	import { Label, Input, Textarea } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import { editProfileValidation } from '$validations';
	import type { EditProfileValues } from '$types/formValues';

	const initialValues: EditProfileValues = {
		fullname: 'Luna',
		bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi doloremque fugiat enim quis itaque iste nulla nisi harum a id iusto consectetur minima dolores illo, rerum cumque. Maxime, excepturi nihil.',
		phone: '9876543210',
		email: 'luna@example.com',
		displayPicture:
			'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues,
		validationSchema: editProfileValidation,
		onSubmit: async (_values) => {
			//
		},
	});

	const handleFileChange = (e: any): void => {
		const file = e.target?.files[0];

		if (file) {
			const reader = new FileReader();
			reader.addEventListener('load', function () {
				form.set({
					...$form,
					displayPicture: reader.result?.toString() as string,
				});
			});
			reader.readAsDataURL(file);
		}
	};
</script>

<form on:submit={handleSubmit} class="py-8 px-4 md:px-16 flex flex-col gap-y-6">
	<div>
		<Label for="photo" class="mb-2">Photo</Label>
		<div class="flex items-center gap-x-8">
			<Avatar alt={$form.fullname} border src={$form.displayPicture} size="lg" rounded id="photo" />
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
			name="fullname"
			placeholder="Enter your name"
			bind:value={$form.fullname}
			on:change={handleChange}
			color={$errors.fullname ? 'red' : 'base'}
		>
			<Icon slot="left" icon="mdi:user" />
		</Input>
		{#if $errors.fullname}
			<Helper class="mt-2" color="red"><span class="font-medium">{$errors.fullname}</span></Helper>
		{/if}
	</div>

	<div>
		<Label for="bio" class="mb-1">Bio</Label>
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
		>
			<Icon slot="left" icon="material-symbols:phone-android-outline-rounded" />
		</Input>
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
