<script lang="ts">
	import styles from './markdown.module.scss';
	import boardStore from '$lib/store/boards.store';
	import type { Board, BoardStore } from '$types/board';
	import Icon from '@iconify/svelte';
	import {
		Avatar,
		Badge,
		Button,
		CloseButton,
		Helper,
		Label,
		Spinner,
		Textarea,
		Tooltip,
	} from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import SvelteMarkdown from 'svelte-markdown';
	import moment from 'moment';
	import type { BoardDescriptionFormValues } from '$types/formValues';
	import { updateBoardDescription } from '$lib/api/appwrite/boards.api';
	import { authStore } from '$lib/store';
	import { boardDescriptionFormSchema } from '$lib/validations/board.validations';

	export let isMenuClosed: boolean;

	let board: Board;

	let unsubscribe = boardStore.subscribe((store: BoardStore) => {
		if (store.currentBoard) {
			board = store.currentBoard;
		}
	});

	let isEditing = false;

	let initialValues: BoardDescriptionFormValues = {
		id: $boardStore.currentBoard?.id ?? '',
		description: $boardStore.currentBoard?.description ?? '',
	};

	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues,
		onSubmit: async (values) => {
			await updateBoardDescription(values);
			isEditing = false;
		},
		validationSchema: boardDescriptionFormSchema,
	});

	onDestroy(unsubscribe);

	const handleCloseMenu = (): void => {
		isMenuClosed = true;
	};

	const openDescriptionEditor = (): void => {
		isEditing = true;
	};

	const handleCancel = (): void => {
		// handleReset();
		form.update((prev) => ({ ...prev, description: $boardStore.currentBoard?.description ?? '' }));
		isEditing = false;
	};
</script>

<aside class="flex flex-col gap-4 mx-0 sm:mx-4">
	<div class="flex items-center border-b">
		<h5
			id="drawer-label"
			class="inline-flex items-center text-base font-semibold text-gray-500 capitalize"
		>
			<span>
				{board.name}
			</span>
		</h5>
		<Badge class="ml-4" color="yellow">{board.isPrivate ? 'Private Board' : 'Public Board'}</Badge>
		<CloseButton on:click={handleCloseMenu} class="mb-4 dark:text-white" />
	</div>

	<!-- CREATED BY INFO -->
	<p class="flex items-center gap-x-2 text-gray-500 text-sm">
		<Icon icon="fa6-solid:circle-user" />
		Made By
	</p>

	<div class="flex gap-x-4">
		<Avatar src={board.owner.displayPicture} rounded />
		<div>
			<p><strong>{board.owner.name}</strong></p>
			<p class="text-xs text-gray-500">
				on {moment(board.createdAt).format('DD MMMM, YYYY')}
			</p>
		</div>
	</div>
	<!-- CREATED BY INFO ENDS -->

	<!-- DESCRIPTION STARTS -->
	<div class="flex items-center text-gray-500 gap-x-8 mt-4 text-sm">
		<p class="flex items-center gap-x-2">
			<Icon icon="basil:document-solid" />
			Description

			{#if $authStore.userDetails.id !== board.owner.id}
				<Icon icon="material-symbols:info-outline" id="descripiton-info-icon" />
				<Tooltip placement="top" triggeredBy="#descripiton-info-icon">
					Only board creators or admins can change the description
				</Tooltip>
			{/if}
		</p>

		{#if !isEditing && $authStore.userDetails.id === board.owner.id}
			<Button color="light" size="xs" on:click={openDescriptionEditor}>
				<span class="flex items-center gap-x-2 text-gray-500">
					<Icon icon="material-symbols:edit" />
					Edit
				</span>
			</Button>
		{/if}
	</div>

	<!-- DESCRIPTION FORM -->
	{#if isEditing}
		<form on:submit={handleSubmit}>
			<Label for="board-description" class="sr-only">Add a description</Label>
			<Textarea
				id="board-description"
				placeholder="Add a description."
				rows={20}
				name="description"
				bind:value={$form.description}
				on:change={handleChange}
				class={$errors.description
					? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400'
					: ''}
			/>

			<Helper color={$errors.description ? 'red' : 'gray'}>
				<span class="font-medium">
					{$errors.description ? $errors.description : 'Use mardown format.'}
				</span>
			</Helper>

			<div class="flex items-center gap-x-4 mt-2">
				<Button color="green" type="submit" size="sm" disabled={$isSubmitting}>
					{#if $isSubmitting}
						<Spinner class="mr-3" size="4" color="white" />Updating...
					{:else}
						Update
					{/if}
				</Button>

				<Button color="light" type="button" size="sm" on:click={handleCancel}>Cancel</Button>
			</div>
		</form>
	{:else if $form.description}
		<div class={styles.markdown}>
			<SvelteMarkdown source={$boardStore.currentBoard?.description ?? ''} />
		</div>
	{:else}
		<p>No description found. Please add one</p>
	{/if}

	<!-- DESCRIPTION ENDS -->

	<!-- TEAM/MEMBER INFO STARTS -->
	<!-- ONLY IF THE BOARD IS PRIVATE -->
	<p class="text-sm text-gray-500 flex items-center gap-x-2 mt-4">
		<span>
			<Icon icon="basil:document-solid" />
		</span>
		<span> Team </span>
	</p>

	{#if board.isPrivate}
		{#if board && board.members}
			{#each board.members as member}
				<div class="flex items-center gap-x-4">
					<Avatar src={member.displayPicture} rounded size="sm" alt={member.name} />
					<p>{member.name}</p>

					<!-- ADMIN BADGE -->
					{#if member.id === board.owner.id}
						<p class="ml-auto text-xs">Admin</p>
					{/if}

					{#if $authStore.userDetails.id === board.owner.id && member.id !== board.owner.id}
						<div class="ml-auto">
							<!-- DISPAY ONLY TO ADMINS -->
							<Button color="red" outline={true} size="xs">Remove</Button>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	{:else}
		<p>This is a public board. Any user can access the board.</p>
		<p>
			If you are the owner of the board, you can make it <strong>private</strong> and limit access to
			select members.
		</p>
	{/if}

	<!-- TEAM/MEMBER INFO ENDS -->
</aside>
