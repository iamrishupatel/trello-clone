import type { CardLabel } from '$types/card';
import type { TaskStatus } from '$types/kanban';

export const getTaskStatus = (allStatus: any[], id: string): TaskStatus => {
	const { $id, text } = allStatus.find((status) => status.$id === id);
	return {
		id: $id,
		text,
	};
};

export const getTaskLabels = (taskLabels: string[], allLabels: CardLabel[]): CardLabel[] => {
	return taskLabels.map((labelId) => {
		const label = allLabels.find((label) => label.id === labelId);
		return label as CardLabel;
	});
};
