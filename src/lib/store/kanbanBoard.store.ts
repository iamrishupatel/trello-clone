import type { KanbanStore } from '$types/kanban';
import { writable } from 'svelte/store';

const initialKanbanStore: KanbanStore = {
	kanbanBoard: {},
};

export const kanbanStore = writable<KanbanStore>(initialKanbanStore);

export default kanbanStore;
