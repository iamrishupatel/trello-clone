<script lang="ts">
	import TEXT from '$constants/text.constants';
	import boardStore from '$lib/store/boards.store';
	import type { Board, BoardStore } from '$types/board';
	import Icon from '@iconify/svelte';
	import { Avatar, Button, CloseButton, Helper, Label, Textarea } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import SvelteMarkdown from 'svelte-markdown';
	import moment from 'moment';
	import type { BoardDescriptionFormValues } from '$types/formValues';
	import { updateBoardDescription } from '$lib/api/appwrite/boards.api';
	import boardDescriptionFormSchema from '$validations/updateBoard.validations';

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
		description: TEXT.DEFAULT_BOARD_DESCRIPTION,
	};

	const { form, errors, handleChange, handleSubmit, handleReset } = createForm({
		initialValues,
		onSubmit: updateBoardDescription,
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
		handleReset();
		isEditing = true;
	};
</script>

<aside class="flex flex-col gap-4 mx-0 sm:mx-4">
	<div class="flex items-center border-b">
		<h5
			id="drawer-label"
			class="inline-flex items-center text-base font-semibold text-gray-500 capitalize"
		>
			{board.name}
		</h5>
		<CloseButton on:click={handleCloseMenu} class="mb-4 dark:text-white" />
	</div>

	<!-- CREATED BY INFO -->
	<p class="flex items-center gap-x-2 text-gray-500 text-sm">
		<Icon icon="fa6-solid:circle-user" />
		Made By
	</p>

	<div class="flex gap-x-4">
		<Avatar src={''} rounded border />
		<div>
			<p><strong>PENDING</strong></p>
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
		</p>

		{#if !isEditing}
			<Button color="light" size="xs" on:click={openDescriptionEditor}>
				<span class="flex items-center gap-x-2">
					<Icon icon="mingcute:pencil-fill" />
					Edit
				</span>
			</Button>
		{/if}
	</div>

	<!-- DESCRIPTION FORM -->
	{#if isEditing}
		<form on:submit={handleSubmit}>
			<Label for="board-description" class="sr-only">Your message</Label>
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
				<Button color="green" type="submit" size="sm">Save</Button>
				<Button color="light" type="button" size="sm" on:click={handleCancel}>Cancel</Button>
			</div>
		</form>
	{:else}
		<SvelteMarkdown source={$form.description} />
	{/if}

	<!-- DESCRIPTION ENDS -->

	<!-- TEAM/MEMBER INFO STARTS -->
	<p class="text-sm text-gray-500 flex items-center gap-x-2 mt-4">
		<span>
			<Icon icon="basil:document-solid" />
		</span>
		<span> Team </span>
	</p>

	{#if board && board.members}
		{#each board.members as member}
			<div class="flex items-center gap-x-4">
				<Avatar src={member.displayPicture} rounded size="sm" alt={member.name} />
				<p>{member.name}</p>

				<!-- DISPAY ONLY TO ADMINS -->
				<div class="ml-auto">
					<Button color="red" outline={true} size="xs">Remove</Button>
				</div>
			</div>
		{/each}
	{/if}
	<!-- TEAM/MEMBER INFO ENDS -->
</aside>
