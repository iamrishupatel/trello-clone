<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import lodash from 'lodash';
	import { updateTaskTitle } from '$lib/api/appwrite/tasks.api';

	export let taskId: string, title: string;

	let isEditing = false;
	let taskInputTitle = title;
	let formEl: HTMLFormElement;

	const openEditor = (): void => {
		isEditing = true;
		tick().then(() => {
			let inpEl = document.getElementById(`inp-${taskId}`) as HTMLInputElement;
			inpEl.focus();
		});
	};

	const closeEditor = (): void => {
		isEditing = false;
	};

	function handleClick(event: Event): void {
		const target = event.target as HTMLElement;
		if (formEl && !formEl.contains(target)) {
			closeEditor();
		}
	}

	onMount(() => {
		window.addEventListener('click', handleClick);
	});

	onDestroy(() => {
		window.removeEventListener('click', handleClick);
	});

	const hanldeTaskTitleChange = (e: Event): void => {
		const target = e.target as HTMLInputElement;

		const update = updateTaskTitle.bind(null, taskId, target.value);
		lodash.debounce(update, 100)();
	};
</script>

<form bind:this={formEl} class="">
	{#if isEditing}
		<input
			class="text-2xl font-bold leading-5 p-0 h-10 w-full"
			id={`inp-${taskId}`}
			bind:value={taskInputTitle}
			on:input={hanldeTaskTitleChange}
			autocomplete="off"
		/>
	{:else}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p
			id="task-title"
			class="text-2xl font-bold leading-5 p-0 h-10 flex items-center"
			on:click|stopPropagation={openEditor}
		>
			{taskInputTitle}
		</p>
	{/if}
</form>
