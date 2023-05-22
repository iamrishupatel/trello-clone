import type { CardLabel } from './card';
import type { User } from './user';

export type KanbanStore = {
	kanbanBoard: KanbanBoardData;
};

export type KanbanBoardData = {
	[columnId: string]: {
		columnName: string;
		tasks: Task[];
	};
};

export type Task = {
	id: string;
	title: string;
	assignees: User[];
	description: string;
	labels: CardLabel[];
	coverUrl?: string;
	status: TaskStatus;
	priority: TaskPriority;
};

export type TaskStatus = {
	id: string;
	text: string;
};

export type TaskPriority = {
	id: string;
	text: 'high' | 'low' | 'medium' | 'low';
	color:
		| 'red'
		| 'yellow'
		| 'green'
		| 'indigo'
		| 'purple'
		| 'pink'
		| 'blue'
		| 'dark'
		| 'none'
		| undefined;
};
