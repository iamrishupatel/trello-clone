<script lang="ts">
	import { handleResetPassword } from '$lib/api/appwrite/auth';
	import { Button, Card, Helper, Input, Label, Spinner } from 'flowbite-svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as Yup from 'yup';
	import logo from '$lib/logos/krello-logo-full.svg';
	import Icon from '@iconify/svelte';
	import ROUTES from '$constants/routes.constants';

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues: {
			email: '',
		},
		onSubmit: async (values) => {
			await handleResetPassword(values.email);
		},
		validationSchema: Yup.object({
			email: Yup.string().email('Please enter a valid email').required('Email address is required'),
		}),
	});
</script>

<Card size="md">
	<img src={logo} alt="krello-brand-logo" class=" mb-6 w-fit h-10 object-contain" />
	<p class="text-2xl">
		<strong> Forgot your password? </strong>
	</p>
	<p class="mt-2 mb-6">
		No Problem. Just let us know your email address and we will email you a password reset link that
		will allow you to choose a new one.
	</p>

	<form class="flex flex-col gap-4" on:submit={handleSubmit}>
		<div>
			<Label class="mb-1">Email Address</Label>
			<Input
				name="email"
				type="email"
				bind:value={$form.email}
				on:change={handleChange}
				placeholder="Enter your email"
			>
				<Icon slot="left" icon="ic:baseline-email" />
			</Input>

			{#if $errors.email}
				<Helper color="red">
					<span class="font-medium">
						{$errors.email}
					</span>
				</Helper>
			{/if}
		</div>
		<div class="sef-end">
			<Button type="submit">
				{#if $isSubmitting}
					<Spinner class="mr-3" size="4" color="white" />Sending you a link...
				{:else}
					Email Password Reset Link
				{/if}
			</Button>
		</div>

		<a href={ROUTES.LOGIN} class="-mb-2 self-end flex items-center gap-2">
			<Icon icon="ic:sharp-arrow-back" /> Back to login
		</a>
	</form>
</Card>
