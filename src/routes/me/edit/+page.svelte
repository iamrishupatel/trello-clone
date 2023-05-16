<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import EditProfileForm from '$components/EditProfile/EditProfileForm.component.svelte';
	import ROUTES from '$constants/routes.constants';
	import TEXT from '$constants/text.constants';
	import { authStore } from '$lib/store';
	import type { AuthState } from '$types/authStore';
	import Icon from '@iconify/svelte';
	import { redirect } from '@sveltejs/kit';

	let authDetails: AuthState | null;

	authStore.subscribe((auth: AuthState) => {
		authDetails = auth;
		if (auth.isAnonymous && browser) {
			goto(ROUTES.HOME);
		} else if (auth.isAnonymous) {
			redirect(303, ROUTES.HOME);
		}
	});
</script>

<title>{`${authDetails?.userDetails?.name ?? 'Profile'} | Krello`}</title>

<main class="flex flex-col min-h-[720px] w-full md:w-10/12 lg:w-8/12 bg-white md:bg-transparent">
	<a href={ROUTES.MY_PROFILE} class="flex items-center gap-x-2 px-4 md:px-0">
		<Icon icon="ic:baseline-arrow-back" />
		Back
	</a>

	<section class="md:mt-12 md:border bg-white border-neutral-300 rounded-3xl w-full">
		<header class="py-8 px-4 md:px-16">
			<h3 class="mb-2 text-xl md:text-3xl">{TEXT.EDIT_PROFILE_PAGE.HEADING}</h3>
			<p class="text-sm">{TEXT.EDIT_PROFILE_PAGE.SUB_HEADING}</p>
		</header>

		<!-- JUST IN CASE  -->
		{#if !$authStore.isAnonymous}
			<EditProfileForm />
		{:else}
			<p class="py-8 px-4 md:px-16">{TEXT.ACCESS_RESTRICTION_MESSAGE}</p>
		{/if}
	</section>
</main>
