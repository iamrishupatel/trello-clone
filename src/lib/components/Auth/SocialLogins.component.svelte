<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
</script>

<div class="flex self-center gap-x-4 sm:gap-x-6">
	<Button pill={true} class="!p-2 text-xl" color="alternative"><Icon icon="mdi:google" /></Button>
	<Button pill={true} class="!p-2 text-xl" color="alternative"><Icon icon="mdi:microsoft" /></Button
	>
	<Button pill={true} class="!p-2 text-xl" color="alternative"
		><Icon icon="carbon:logo-facebook" /></Button
	>
	<Button pill={true} class="!p-2 text-xl" color="alternative"><Icon icon="mdi:twitter" /></Button>
	<Button pill={true} class="!p-2 text-xl" color="alternative"><Icon icon="mdi:github" /></Button>
</div>
