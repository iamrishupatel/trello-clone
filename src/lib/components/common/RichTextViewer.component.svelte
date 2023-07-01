<script lang="ts">
	import styles from '$sass/markdown.module.scss';
	import SvelteMarkdown from 'svelte-markdown';
	export let source: string;
</script>

<div class={styles.markdown}>
	<SvelteMarkdown {source} />
</div>
