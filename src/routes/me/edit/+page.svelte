<script lang="ts">
	import EditProfileForm from '$components/EditProfile/EditProfileForm.component.svelte';
	import ROUTES from '$constants/routes.constants';
	import Icon from '@iconify/svelte';
</script>

<main class="flex flex-col min-h-[720px] w-full md:w-10/12 lg:w-8/12 bg-white md:bg-transparent">
	<a href={ROUTES.MY_PROFILE} class="flex items-center gap-x-2 px-4 md:px-0">
		<Icon icon="ic:baseline-arrow-back" />
		Back
	</a>

	<section class="md:mt-12 md:border bg-white border-neutral-300 rounded-3xl w-full">
		<header class="py-8 px-4 md:px-16">
			<h3 class="mb-2 text-xl md:text-3xl">Change Info</h3>
			<p class="text-sm">Changes will be reflected to every service.</p>
		</header>

		<EditProfileForm />
	</section>
</main>
