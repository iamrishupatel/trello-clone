<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from 'flowbite-svelte';

	export let handleFileChange: (e: Event) => void;

	let inpEl: HTMLInputElement;
	const openUpload = (): void => {
		inpEl.click();
	};
</script>

<Button color="light" class="w-full !justify-start text-slate-500" on:click={openUpload}>
	<Icon icon="material-symbols:image" class="-ml-2" />
	<span class="ml-2">Cover</span>
</Button>

<input type="file" class="hidden" bind:this={inpEl} on:change={handleFileChange} />
