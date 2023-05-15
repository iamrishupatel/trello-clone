<script lang="ts">
	import ROUTES from '$constants/routes.constants';
	import { Avatar, Button, Modal } from 'flowbite-svelte';
	import ProfileItem from './components/ProfileItem.component.svelte';
	import { authStore } from '$lib/store';
	import { goto } from '$app/navigation';
	import type { AuthState } from '$types/authStore';
	import { onDestroy } from 'svelte';
	import TEXT from '$constants/text.constants';

	const userDetails = $authStore.userDetails;
	let showModal = false;

	let authDetails: AuthState | null;
	const unsubscribe = authStore.subscribe((authState: AuthState) => {
		authDetails = authState;
	});

	onDestroy(unsubscribe);

	const goToEditPage = async (): Promise<void> => {
		if (authDetails && authDetails.isAnonymous) {
			showModal = true;
			return;
		}
		// if user is not anonymous
		await goto(ROUTES.EDIT_PROFILE);
	};
</script>

<main
	class="flex flex-col items-center min-h-[720px] w-full md:w-10/12 lg:w-8/12 bg-white md:bg-transparent"
>
	<h1 class="font-medium text-2xl md:text-4xl px-4 md:px-0">Personal Info</h1>
	<p class="md:text-md px-4 md:px-0">Basic info, like your name and photo</p>

	<section class="mt-12 md:border bg-white border-neutral-300 rounded-3xl w-full">
		<header class="py-8 px-4 md:px-16 flex items-center hover:no-underline">
			<div class="mr-auto">
				<h3 class="mb-2 text-xl md:text-3xl">Profile</h3>
				<p class="text-sm max-w-[200px] md:max-w-fit">Some info may be visible to other people</p>
			</div>
			<Button color="light" on:click={goToEditPage}>Edit</Button>
		</header>

		<section
			class="border-t flex py-8 px-4 md:px-16 items-center justify-between md:justify-normal"
		>
			<p class="font-semibold md:font-normal w-32 md:w-48 xl:w-96">Photo</p>

			<Avatar alt={userDetails.name} border src={userDetails.displayPicture} size="lg" rounded />
		</section>
		<ProfileItem fieldName="Name" value={userDetails.name} />
		<ProfileItem fieldName="Bio" value={userDetails.bio} />
		<ProfileItem fieldName="Phone" value={userDetails.phone} />
		<ProfileItem fieldName="Email" value={userDetails.email} />
	</section>
</main>

<!--  -->
<Modal bind:open={showModal} size="xs" autoclose>
	<div class="text-center">
		<svg
			aria-hidden="true"
			class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<p class="mb-5 font-normal text-gray-500 dark:text-gray-400">
			{TEXT.ACCESS_RESTRICTION_MESSAGE}
		</p>
		<Button>Go Back</Button>
	</div>
</Modal>
