<script lang="ts">
	export let fieldName: string;
	export let value: string;
</script>

<section class="border-t flex flex-col md:flex-row py-8 px-4 md:px-16 md:items-center">
	<p class="font-semibold md:font-normal w-32 md:w-48 xl:w-96">{fieldName}</p>
	<p class="flex-1 break-all">{value ? value : '-'}</p>
</section>
