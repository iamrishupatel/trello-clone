import { getUserData } from '$lib/api/appwrite/userDetails.api';
import { getPriority, getTaskLabels, getTaskStatus } from '$lib/helpers/status.helper';
import boardStore from '$lib/store/boards.store';
import type { CommentDoc } from '$types/appwriteDocs.types';
import type { CardLabel } from '$types/card';
import type { CommentType, Task } from '$types/kanban';

export const enhanceTasksData = (tasks: any[], allStatus: any[]): Task[] => {
	return tasks.map((task) => enhanceSingleTask(task, allStatus));
};

export const enhanceSingleTask = (task: any, allStatus: any[]): Task => {
	let allLabels: CardLabel[] = [];
	boardStore.subscribe((board) => {
		allLabels = board.labels;
	});
	const enhancedTask: Task = {
		id: task.$id,
		status: getTaskStatus(allStatus, task.status),
		prevStatusId: task.prevStatusId,
		title: task.title,
		description: task.description,
		coverUrl: task.coverUrl,
		boardId: task.boardId,
		assignees: [],
		labels: getTaskLabels(task.labels, allLabels),
		priority: getPriority(task.priority),
	};

	return enhancedTask;
};

export const enhanceComment = async (comment: CommentDoc): Promise<CommentType> => {
	const author = await getUserData(comment.author);
	return {
		id: comment.$id,
		body: comment.body,
		createdAt: comment.$createdAt,
		author,
		isEdited: comment.isEdited,
	};
};
