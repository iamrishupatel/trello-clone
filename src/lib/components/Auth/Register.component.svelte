<script lang="ts">
	import { InputFieldType } from '$enums/Input.enums';
	import type { CreateAccountFormValues } from '$types/formValues';
	import { createAccountValidation } from '$validations';
	import Icon from '@iconify/svelte';
	import { Button, Helper, Input, Label, Spinner } from 'flowbite-svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';
	import { createForm } from 'svelte-forms-lib';
	import { createAccount } from '$api/appwrite/auth';

	let passwordFieldType: InputType = 'password';
	const changePasswordFiledType = (): void => {
		if (passwordFieldType === InputFieldType.PASSWORD) {
			passwordFieldType = InputFieldType.TEXT;
		} else {
			passwordFieldType = InputFieldType.PASSWORD;
		}
	};

	const initialValues: CreateAccountFormValues = {
		name: '',
		email: '',
		password: '',
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues,
		validationSchema: createAccountValidation,
		onSubmit: createAccount,
	});
</script>

<form class="flex flex-col gap-y-4" on:submit|preventDefault={handleSubmit}>
	<!-- NAME FIELD -->
	<div>
		<Label for="name" class="mb-1">Name</Label>
		<Input
			id="name"
			type="text"
			placeholder="John Doe"
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

	<!-- EMAIL FIELD -->
	<div>
		<Label for="email" class="mb-1">Email</Label>
		<Input
			id="email"
			type="email"
			placeholder="name@rlabs.dev"
			bind:value={$form.email}
			on:change={handleChange}
			color={$errors.email ? 'red' : 'base'}
		>
			<Icon slot="left" icon="ic:baseline-email" />
		</Input>
		{#if $errors.email}
			<Helper class="mt-2" color="red"><span class="font-medium">{$errors.email}</span></Helper>
		{/if}
	</div>

	<!-- PASSWORD FIELD -->
	<div class="flex flex-col">
		<Label for="password" class="mb-1">Password</Label>
		<Input
			id="password"
			type={passwordFieldType}
			bind:value={$form.password}
			on:change={handleChange}
			color={$errors.password ? 'red' : 'base'}
			placeholder="Enter your password"
		>
			<Icon slot="left" icon="material-symbols:lock" />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<p on:click={changePasswordFiledType} slot="right" class="cursor-pointer">
				{#if passwordFieldType === InputFieldType.PASSWORD}
					<Icon icon="ic:baseline-remove-red-eye" />
				{:else}
					<Icon icon="mdi:eye-off" />
				{/if}
			</p>
		</Input>

		{#if $errors.password}
			<Helper class="mt-2" color="red"><span class="font-medium">{$errors.password}</span></Helper>
		{/if}
	</div>

	<!-- SUBMIT -->

	<Button type="submit" disabled={$isSubmitting}>
		{#if $isSubmitting}
			<Spinner class="mr-3" size="4" color="white" />Creating...
		{:else}
			Create Account
		{/if}
	</Button>

	<!-- <Button color="alternative" type="button">Continue as a Guest</Button> -->
</form>
