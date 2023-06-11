<script lang="ts">
	import { page } from '$app/stores';
	import ErrorDisplay from '$components/common/ErrorDisplay.component.svelte';
</script>

{#if $page.status === 404}
	<ErrorDisplay />
{:else if $page.status === 500}
	<ErrorDisplay
		errorTitle="It's Not You, It's Us"
		errorCode={$page.status}
		errorDescription={$page.error?.message}
	/>
{:else}
	<ErrorDisplay errorCode={$page.status} errorDescription={$page.error?.message} />
{/if}
