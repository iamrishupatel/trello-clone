import type { KanbanBoardData, Task } from '$lib/types/kanban';

export function generateKanbanBoardFromTasks(tasks: Task[], allStatus: any[]): KanbanBoardData {
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
