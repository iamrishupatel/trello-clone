<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import type { Task } from '$types/kanban';
	import TaskTitle from './TaskTitle.component.svelte';
	import TaskStatus from './TaskStatus.component.svelte';
	import TaskDescription from './TaskDescription.component.svelte';
	import TaskPriority from './TaskPriority.component.svelte';

	export let taskDetails: Task | null,
		isModalOpen = false;
</script>

{#if taskDetails}
	<Modal bind:open={isModalOpen} size="lg" title="Task Details">
		<div class="w-screen max-w-[900px] min-h-[50rem] relative flex flex-col gap-4">
			{#if taskDetails.coverUrl}
				<img
					src={taskDetails.coverUrl}
					alt="task-cover"
					class="h-48 rounded-lg w-full object-cover mb-4"
				/>
			{/if}

			<div class="flex flex-col gap-y-2">
				<TaskTitle taskId={taskDetails.id} title={taskDetails.title} />
				<TaskStatus status={taskDetails.status} taskId={taskDetails.id} />
				<TaskPriority priority={taskDetails.priority} taskId={taskDetails.id} />
			</div>

			<div class="flex gap-8">
				<section class="flex-1 flex flex-col gap-y-4">
					<TaskDescription taskDescription={taskDetails.description} taskId={taskDetails.id} />
				</section>

				<section class="w-60" />
			</div>
		</div>
	</Modal>
{/if}
