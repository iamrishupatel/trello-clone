<script lang="ts">
	import { Button, Card, Helper, Input, Label, Spinner } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import Icon from '@iconify/svelte';
	import ROUTES from '$constants/routes.constants';
	import logo from '$lib/logos/krello-logo-full.svg';
	import { updatePassword } from '$lib/api/appwrite/auth';
	import { resetPasswordSchema } from '$lib/validations/auth.validations';

	export let userId: string, secret: string;

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues: {
			password: '',
			confirmPassword: '',
		},
		onSubmit: async (values) => {
			await updatePassword(userId, secret, values.password, values.confirmPassword);
		},
		validationSchema: resetPasswordSchema,
	});
</script>

<Card size="md">
	<img src={logo} alt="krello-brand-logo" class=" mb-6 w-fit h-10 object-contain" />
	<p class="text-2xl">
		<strong>Choose new password. </strong>
	</p>
	<p class="mt-2 mb-6">Almost done. Enter your new password and you are all set.</p>
	<form on:submit={handleSubmit} class="flex flex-col gap-4">
		<div>
			<Label class="mb-1">New Password</Label>
			<Input
				name="password"
				type="password"
				bind:value={$form.password}
				on:change={handleChange}
				placeholder="Enter new password"
			>
				<Icon slot="left" icon="material-symbols:lock" />
			</Input>

			{#if $errors.password}
				<Helper color="red">
					<span class="font-medium">
						{$errors.password}
					</span>
				</Helper>
			{/if}
		</div>

		<div>
			<Label class="mb-1">Confirm Password</Label>
			<Input
				name="confirmPassword"
				type="password"
				bind:value={$form.confirmPassword}
				on:change={handleChange}
				placeholder="Confirm your password"
			>
				<Icon slot="left" icon="material-symbols:lock" />
			</Input>

			{#if $errors.confirmPassword}
				<Helper color="red">
					<span class="font-medium">
						{$errors.confirmPassword}
					</span>
				</Helper>
			{/if}
		</div>

		<div>
			<Button type="submit">
				{#if $isSubmitting}
					<Spinner class="mr-3" size="4" color="white" />Changing your password...
				{:else}
					Change Password
				{/if}
			</Button>
		</div>
		<a href={ROUTES.LOGIN} class="-mb-2 self-end flex items-center gap-2">
			<Icon icon="ic:sharp-arrow-back" /> Back to login
		</a>
	</form>
</Card>
