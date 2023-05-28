import type { KanbanBoardData, Task, TaskStatus } from '$types/kanban';

// TODO: renames and refactor
export const enhanceTaskData = (tasks: any[], allStatus: any[]): Task[] => {
	const etasks: Task[] = tasks.map((task) => taskEnhancer(task, allStatus));
	return etasks;
};

export const taskEnhancer = (task: any, allStatus: any[]): Task => {
	const eTask: Task = {
		id: task.$id,
		status: getStatus(allStatus, task.status),
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

	return eTask;
};

// move to factory folder
export function convertTasksToKanbanBoardData(tasks: Task[], allStatus: any[]): KanbanBoardData {
	const emptykanbanBoard = allStatus.reduce((acc, status) => {
		const { $id, text } = status;

		if (!Object.hasOwn(acc, $id)) {
			acc[$id] = {
				columnName: text,
				tasks: [],
			};
		}
		return acc;
	}, {});
	//
	return tasks.reduce((kanbanBoardData: KanbanBoardData, task: Task) => {
		const { status } = task;
		if (!kanbanBoardData[status.id]) {
			kanbanBoardData[status.id] = {
				columnName: status.text,
				tasks: [],
			};
		}

		kanbanBoardData[status.id].tasks.push(task);

		return kanbanBoardData;
	}, emptykanbanBoard);
}

const getStatus = (allStatus: any[], id: string): TaskStatus => {
	const { $id, text } = allStatus.find((status) => status.$id === id);
	return {
		id: $id,
		text,
	};
};
