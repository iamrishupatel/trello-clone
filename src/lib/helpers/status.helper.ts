import { TASK_PRIORITIES } from '$lib/constants/app.constans';
import type { CardLabel } from '$lib/types/card';
import type { TaskStatus, TaskPriority } from '$lib/types/kanban';

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

export const getPriority = (taskPriorityId: string): TaskPriority | null => {
	const priority = TASK_PRIORITIES.find((tp) => tp.id === taskPriorityId);
	return priority ?? null;
};
