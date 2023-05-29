import type { TaskStatus } from '$types/kanban';

export const getTaskStatus = (allStatus: any[], id: string): TaskStatus => {
	const { $id, text } = allStatus.find((status) => status.$id === id);
	return {
		id: $id,
		text,
	};
};
