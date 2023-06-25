<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	export let options = { placeholder: 'Anything goes here...' };
	export let markdownContent = '';

	let node: HTMLDivElement;

	const dispatch = createEventDispatcher();

	const toolbarOptions = [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ header: 1 }, { header: 2 }], // custom button values
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
	];

	let quill: any;
	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(node, {
			modules: {
				syntax: true,
				toolbar: toolbarOptions,
			},
			theme: 'snow',
			...options,
		});

		if (markdownContent) {
			const delta = quill.clipboard.convert(markdownContent);
			quill.setContents(delta);
		}

		const container = node.getElementsByClassName('ql-editor')[0];

		quill.on('text-change', function () {
			dispatch('change', {
				html: container.innerHTML,
				text: quill.getText().trim(),
			});
		});
		const toolbar = document.querySelector('.ql-toolbar') as HTMLDivElement;
		const editor = document.querySelector('.ql-container') as HTMLDivElement;

		toolbar.style.borderTopLeftRadius = '8px';
		toolbar.style.borderTopRightRadius = '8px';
		editor.style.borderBottomLeftRadius = '8px';
		editor.style.borderBottomRightRadius = '8px';
	});

	onDestroy(() => {
		if (browser && document) {
			const els = document.querySelectorAll('div[class^=\'ql-\']');
			for (const el of els) {
				if (el.parentNode !== null) {
					el.parentNode.removeChild(el);
				}
			}
		}
	});

	const focusOnQuill = (): void => {
		if (quill) {
			quill.focus();
		}
	};
</script>

<div
	class="editor min-h-[200px] max-h-[400px] overflow-y-auto text-base"
	bind:this={node}
	on:click={focusOnQuill}
	on:keydown={focusOnQuill}
/>
