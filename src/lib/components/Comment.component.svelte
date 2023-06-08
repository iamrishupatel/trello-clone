<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import styles from '$sass/markdown.module.scss';
	import moment from 'moment';
	import type { CommentType } from '$types/kanban';

	export let comment: CommentType;
</script>

<div class="flex flex-col gap-4 mb-8">
	<div class="flex justify-between">
		<div class="w-fit flex gap-2">
			<Avatar src={comment.author.displayPicture} rounded />
			<div class="flex flex-col">
				<p>{comment.author.name}</p>
				<p class="text-xs">{moment(comment.createdAt).format('DD MMMM [at] hh:mm A')}</p>
			</div>
		</div>

		<div class="flex gap-2 text-sm">
			<p class="hover:underline cursor-pointer"><strong> Edit</strong></p>
			<p class="hover:underline cursor-pointer">
				<strong> Delete </strong>
			</p>
		</div>
	</div>
	<div class={`${styles.markdown} border px-4 bg-gray-50 rounded-lg`}>
		<SvelteMarkdown source={comment.body ?? ''} />
	</div>
</div>
