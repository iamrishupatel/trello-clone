<script lang="ts">
	import ROUTES from '$constants/routes.constants';
	import { Avatar, Button } from 'flowbite-svelte';
	import ProfileItem from './components/ProfileItem.component.svelte';

	const userDetails = {
		fullname: 'Luna Lovegood',
		bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi doloremque fugiat enim quis itaque iste nulla nisi harum a id iusto consectetur minima dolores illo, rerum cumque. Maxime, excepturi nihil.',
		phone: '9876543210',
		email: 'luna@example.com',
		displayPicture:
			'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
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
			<Button color="light" href={ROUTES.EDIT_PROFILE}>Edit</Button>
		</header>

		<section
			class="border-t flex py-8 px-4 md:px-16 items-center justify-between md:justify-normal"
		>
			<p class="font-semibold md:font-normal w-32 md:w-48 xl:w-96">Photo</p>

			<Avatar
				alt={userDetails.fullname}
				border
				src={userDetails.displayPicture}
				size="lg"
				rounded
			/>
		</section>
		<ProfileItem fieldName="Name" value={userDetails.fullname} />
		<ProfileItem fieldName="Bio" value={userDetails.bio} />
		<ProfileItem fieldName="Phone" value={userDetails.phone} />
		<ProfileItem fieldName="Email" value={userDetails.email} />
	</section>
</main>
