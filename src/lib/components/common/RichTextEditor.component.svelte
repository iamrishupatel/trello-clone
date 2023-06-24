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

	onMount(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { default: Quill } = await import('quill');

		let quill = new Quill(node, {
			modules: {
				syntax: true,
				toolbar: toolbarOptions,
			},
			theme: 'snow',
			...options,
		});

		quill.clipboard.addMatcher(Node.ELEMENT_NODE, function (_node: HTMLDivElement, delta: any) {
			delta.forEach((e: any) => {
				if (e.attributes) {
					e.attributes.color = '';
					e.attributes.background = '';
				}
			});
			quill.clipboard.addMatcher(Node.ELEMENT_NODE, function (_node: any, delta: any) {
				delta.forEach((e: any) => {
					if (e.attributes) {
						e.attributes.color = '';
						e.attributes.background = '';
					}
				});
				return delta;
			});
			return delta;
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
	});

	onDestroy(() => {
		if (node) {
			// node.removeEventListener('text-change', handleTextChange);
		}
		if (browser && document) {
			const els = document.querySelectorAll('div[class^=\'ql-\']');
			for (const el of els) {
				if (el.parentNode !== null) {
					el.parentNode.removeChild(el);
				}
			}
		}
	});
</script>

<div class="editor min-h-[100px] max-h-[400px] overflow-y-auto" bind:this={node} />
