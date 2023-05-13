<script lang="ts">
	import ROUTES from '$constants/routes.constants';
	import { InputFieldType } from '$enums/Input.enums';
	import Icon from '@iconify/svelte';
	import { Button, Input, Label } from 'flowbite-svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';

	let passwordFieldType: InputType = 'password';

	function changePasswordFiledType(): void {
		if (passwordFieldType === InputFieldType.PASSWORD) {
			passwordFieldType = InputFieldType.TEXT;
		} else {
			passwordFieldType = InputFieldType.PASSWORD;
		}
	}
</script>

<section class="flex flex-col gap-y-4">
	<div>
		<Label for="email" class="mb-1">Email</Label>
		<Input id="email" type="email" placeholder="name@rlabs.dev">
			<Icon slot="left" icon="ic:baseline-email" />
		</Input>
	</div>

	<div class="flex flex-col">
		<Label for="password" class="mb-1">Password</Label>
		<Input id="password" type={passwordFieldType} placeholder="Enter your password">
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

		<a href={ROUTES.RESET_PASSWORD} class="ml-auto text-sm text-primary-700 mt-1"
			>Forgot password?</a
		>
	</div>

	<Button type="submit">Sign In</Button>
	<Button color="alternative" type="button">Continue as a Guest</Button>
</section>
