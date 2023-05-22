import { generateFakeTasks } from '$lib/helpers/faker.helpers';
import type { KanbanBoardData } from '$types/kanban';

export const getkanbanBoard = async (): Promise<KanbanBoardData> => {
	// mock data
	const data = {
		'1': {
			columnName: '📥 Backlog',
			tasks: generateFakeTasks(4),
		},
		'2': {
			columnName: '📝 Todo',
			tasks: generateFakeTasks(0),
		},
		'3': {
			columnName: '⏳ In Progress',
			tasks: generateFakeTasks(0),
		},
		'4': {
			columnName: '🔍 In Review',
			tasks: generateFakeTasks(1),
		},
		'5': {
			columnName: '✅ Done',
			tasks: generateFakeTasks(1),
		},
	};
	return data;
};
