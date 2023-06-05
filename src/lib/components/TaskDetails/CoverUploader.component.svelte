<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from 'flowbite-svelte';

	let inpEl: HTMLInputElement;
	const openUpload = (): void => {
		inpEl.click();
	};

	const handleFileChange = (e: any): void => {
		const file = e.target?.files[0];

		if (file) {
			console.log(file);
		}
	};
</script>

<Button color="light" class="w-full" on:click={openUpload}>
	<Icon icon="material-symbols:image" />
	<span class="ml-2">Cover</span>
</Button>

<input type="file" class="hidden" bind:this={inpEl} on:change={handleFileChange} />
