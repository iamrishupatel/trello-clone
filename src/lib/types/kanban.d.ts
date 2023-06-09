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
	boardId: string;
	title: string;
	assignees: User[];
	description: string;
	labels: CardLabel[];
	coverUrl?: string;
	status: TaskStatus;
	prevStatusId: string;
	priority: TaskPriority | null;
};

export type TaskStatus = {
	id: string;
	text: string;
};

export type TaskPriority = {
	id: string;
	text: 'high' | 'urgent' | 'medium' | 'low';
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

export type TaskCreationPayload = {
	title: string;
	status: string;
	boardId: string;
	prevStatusId: string;
	coverUrl?: string;
	labels: string[];
	priority?: string;
	description: string;
};

export type CommentType = {
	id: string;
	body: string;
	createdAt: string;
	author: User;
	isEdited: boolean;
};

export type CommentCreationPayload = {
	body: string;
	author: string;
	taskId: string;
	isEdited: boolean;
};
