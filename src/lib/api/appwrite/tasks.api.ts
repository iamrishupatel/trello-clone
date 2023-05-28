import APPWRITE_CONST from '$constants/appwrite.constants';
import type { KanbanBoardData, TaskCreationPayload } from '$types/kanban';
import { faker } from '@faker-js/faker';
import { db } from './client';
import { v4 as uuidv4 } from 'uuid';
import toast from 'svelte-french-toast';
import {
	convertTasksToKanbanBoardData,
	enhanceTaskData,
	taskEnhancer,
} from '$lib/transformers/task.transformer';
import { kanbanStore } from '$lib/store';

// CONSTANTS USED
const { KRELLO_DB_ID, TASK_COLLECTION_ID, STATUS_COLLECTION_ID } = APPWRITE_CONST;

export const getkanbanBoard = async (currentBoardId: string): Promise<KanbanBoardData> => {
	const [statusDoc, taskDocs] = await Promise.all([
		db.listDocuments(KRELLO_DB_ID, STATUS_COLLECTION_ID),
		db.listDocuments(KRELLO_DB_ID, TASK_COLLECTION_ID),
	]);

	const tasks = taskDocs.documents.filter((task) => task.boardId === currentBoardId);

	const enhancedTasks = enhanceTaskData(tasks, statusDoc.documents);
	return convertTasksToKanbanBoardData(enhancedTasks, statusDoc.documents);
};

export const createNewTask = async (boardId: string, statusId: string): Promise<void> => {
	const { KRELLO_DB_ID, TASK_COLLECTION_ID } = APPWRITE_CONST;
	const taskDocId = uuidv4();
	const payload: TaskCreationPayload = {
		title: faker.lorem.words(),
		status: statusId,
		boardId,
		prevStatusId: statusId,
	};

	try {
		await db.createDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskDocId, payload);
		toast.success('Task created successfully');
		// TODO: after task is created add it to store
		// and hanlde the create event for this as well
	} catch (e: any) {
		toast.error(e.message);
	}
};

export const updateTaskStatus = async (
	taskId: string,
	statusId: string,
	prevStatusId: string,
): Promise<void> => {
	try {
		await db.updateDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskId, {
			status: statusId,
			prevStatusId,
		});
	} catch (e) {
		// FIXME: handle errors
		// remove permissions to mimic errors
		console.log(e);
	}
};

// HANLDE EVENTS
// TODO: refactor needed.
// move store related code store file
export const hanldeTaskCreateEvent = async (task: any, currentBoardId: string): Promise<void> => {
	// check if task is of current board
	if (currentBoardId !== task.boardId) {
		return;
	}
	// FIXME: remove this API CALL
	const statusDoc = await db.listDocuments(KRELLO_DB_ID, STATUS_COLLECTION_ID);
	const enhancedTask = taskEnhancer(task, statusDoc.documents);

	kanbanStore.update((prevStore) => {
		const hasOwn = Object.hasOwn(prevStore.kanbanBoard, enhancedTask.status.id);

		if (!hasOwn) {
			return prevStore;
		}

		prevStore.kanbanBoard[enhancedTask.status.id].tasks.push(enhancedTask);
		return prevStore;
	});
};

export const hanldeTaskUpdateEvent = async (task: any, currentBoardId: string): Promise<void> => {
	// check if task is of current board

	if (currentBoardId !== task.boardId) {
		return;
	}

	const statusDoc = await db.listDocuments(KRELLO_DB_ID, STATUS_COLLECTION_ID);
	const enhancedTask = taskEnhancer(task, statusDoc.documents);

	kanbanStore.update((prevStore) => {
		const canUpdate =
			Object.hasOwn(prevStore.kanbanBoard, enhancedTask.prevStatusId) &&
			Object.hasOwn(prevStore.kanbanBoard, enhancedTask.status.id);

		if (!canUpdate) {
			return prevStore;
		}

		if (enhancedTask.prevStatusId !== enhancedTask.status.id) {
			// status changed

			// remove old task
			prevStore.kanbanBoard[enhancedTask.prevStatusId].tasks = prevStore.kanbanBoard[
				enhancedTask.prevStatusId
			].tasks.filter((task) => task.id !== enhancedTask.id);

			// TODO: hanlde if already exist as well
			if (
				prevStore.kanbanBoard[enhancedTask.status.id].tasks.findIndex(
					(task) => task.id === enhancedTask.id,
				) < 0
			) {
				prevStore.kanbanBoard[enhancedTask.status.id].tasks.push(enhancedTask);
			}

			return prevStore;
		}

		// something other than status has changed.
		// update the old task itself
		// TODO: testng required

		if (enhancedTask.prevStatusId === enhancedTask.status.id) {
			prevStore.kanbanBoard[enhancedTask.status.id].tasks = prevStore.kanbanBoard[
				enhancedTask.status.id
			].tasks.map((task) => {
				if (task.id === enhancedTask.id) {
					return enhancedTask;
				}
				return task;
			});
		}

		return prevStore;
	});
};

export const hanldeTaskDeleteEvent = async (task: any, currentBoardId: string): Promise<void> => {
	// check if task is of current board
	if (currentBoardId !== task.boardId) {
		return;
	}

	// remove the task
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
