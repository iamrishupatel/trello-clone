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
	const labels: CardLabel[] = [];
	taskLabels.forEach((labelId) => {
		const label = allLabels.find((label) => label.id === labelId);
		if (label) labels.push(label);
	});
	return labels;
};
