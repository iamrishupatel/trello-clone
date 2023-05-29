import { getTaskStatus } from '$lib/helpers/status.helper';
import type { Task } from '$types/kanban';

export const enhanceTasksData = (tasks: any[], allStatus: any[]): Task[] => {
	return tasks.map((task) => enhanceSingleTask(task, allStatus));
};

export const enhanceSingleTask = (task: any, allStatus: any[]): Task => {
	const enhancedTask: Task = {
		id: task.$id,
		status: getTaskStatus(allStatus, task.status),
		prevStatusId: task.prevStatusId,
		title: task.title,
		description: task.description,
		coverUrl: task.coverUrl,
		boardId: task.boardId,
		assignees: [],
		labels: [],
		priority: {
			color: 'red',
			id: 'priority',
			text: 'high',
		},
	};

	return enhancedTask;
};
