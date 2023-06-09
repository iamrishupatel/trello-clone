import type { KanbanStore, Task } from '$lib/types/kanban';
import { writable } from 'svelte/store';

const initialKanbanStore: KanbanStore = {
	kanbanBoard: {},
};

export const kanbanStore = writable<KanbanStore>(initialKanbanStore);

export default kanbanStore;

// functions to update the store.
export const removeTaskFromStore = (task: any): void => {
	kanbanStore.update((prevStore) => {
		const hasOwn = Object.hasOwn(prevStore.kanbanBoard, task.status);

		if (!hasOwn) {
			return prevStore;
		}

		prevStore.kanbanBoard[task.status].tasks = prevStore.kanbanBoard[task.status].tasks.filter(
			(oldTask) => oldTask.id !== task.$id,
		);
		return prevStore;
	});
};

export const addNewTaskInStore = (newTask: Task): void => {
	kanbanStore.update((prevStore) => {
		const hasOwn = Object.hasOwn(prevStore.kanbanBoard, newTask.status.id);

		if (!hasOwn) {
			return prevStore;
		}

		prevStore.kanbanBoard[newTask.status.id].tasks.push(newTask);
		return prevStore;
	});
};

export const updateTask = (updatedTask: Task): void => {
	kanbanStore.update((prevStore) => {
		const canUpdate =
			Object.hasOwn(prevStore.kanbanBoard, updatedTask.prevStatusId) &&
			Object.hasOwn(prevStore.kanbanBoard, updatedTask.status.id);

		if (!canUpdate) {
			return prevStore;
		}

		const oldColTasks = prevStore.kanbanBoard[updatedTask.prevStatusId].tasks;
		const newColTasks = prevStore.kanbanBoard[updatedTask.status.id].tasks;

		if (updatedTask.prevStatusId !== updatedTask.status.id) {
			// status changed

			// remove task from previous column
			prevStore.kanbanBoard[updatedTask.prevStatusId].tasks = oldColTasks.filter(
				(task) => task.id !== updatedTask.id,
			);

			// for the user that made the update task is already in the new column via dragging
			// check if the destination already has the task
			if (newColTasks.findIndex((task) => task.id === updatedTask.id) < 0) {
				// task not in the new column so lets add it
				prevStore.kanbanBoard[updatedTask.status.id].tasks.push(updatedTask);
			}

			return prevStore;
		}

		// something other than status has changed.
		// update the old task itself
		// TODO: testng required
		if (updatedTask.prevStatusId === updatedTask.status.id) {
			prevStore.kanbanBoard[updatedTask.status.id].tasks = newColTasks.map((task) => {
				if (task.id === updatedTask.id) {
					return updatedTask;
				}
				return task;
			});
		}

		return prevStore;
	});
};
