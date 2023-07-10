import type { Task } from './kanban';

export type AppConfigContext = {
	showBoardNameInNav: boolean;
	showSearch: boolean;
};

export type TaskContext = {
	taskDetails: Task;
};
