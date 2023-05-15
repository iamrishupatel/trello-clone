<script lang="ts">
	import ROUTES from '$constants/routes.constants';
	import { InputFieldType } from '$enums/Input.enums';
	import { authStore } from '$lib/store';
	import type { LoginFormValues } from '$types/formValues';
	import { loginFormValidation } from '$validations';
	import Icon from '@iconify/svelte';
	import { Button, Helper, Input, Label, Spinner } from 'flowbite-svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';
	import { createForm } from 'svelte-forms-lib';
	import { createAnonSession, handleEmailPasswordLogin } from '$api/appwrite/auth';
	import { AuthStatus } from '$enums/AuthStatus.enums';

	let passwordFieldType: InputType = 'password';

	function changePasswordFiledType(): void {
		if (passwordFieldType === InputFieldType.PASSWORD) {
			passwordFieldType = InputFieldType.TEXT;
		} else {
			passwordFieldType = InputFieldType.PASSWORD;
		}
	}

	const initialValues: LoginFormValues = {
		email: '',
		password: '',
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues,
		validationSchema: loginFormValidation,
		onSubmit: handleEmailPasswordLogin,
	});
</script>

<form class="flex flex-col gap-y-4" on:submit={handleSubmit}>
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

	<div class="flex flex-col">
		<Label for="password" class="mb-1">Password</Label>
		<Input
			id="password"
			type={passwordFieldType}
			placeholder="Enter your password"
			bind:value={$form.password}
			on:change={handleChange}
			color={$errors.password ? 'red' : 'base'}
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

		<a href={ROUTES.RESET_PASSWORD} class="ml-auto text-sm text-primary-700 mt-1"
			>Forgot password?</a
		>
	</div>

	<Button
		type="submit"
		disabled={$isSubmitting || $authStore.authStatus === AuthStatus.IN_PROGRESS}
	>
		{#if $isSubmitting}
			<Spinner class="mr-3" size="4" color="white" />Loggin you in...
		{:else}
			Sign In
		{/if}
	</Button>

	<!-- continue as guest -->
	<Button
		color="alternative"
		type="button"
		on:click={createAnonSession}
		disabled={$isSubmitting || $authStore.authStatus === AuthStatus.IN_PROGRESS}
	>
		{#if $authStore.authStatus === AuthStatus.IN_PROGRESS}
			<Spinner class="mr-3" size="4" color="white" />Creating a anonymous session...
		{:else}
			Continue as a Guest
		{/if}
	</Button>
</form>
