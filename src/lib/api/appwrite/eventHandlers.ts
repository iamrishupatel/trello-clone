import { enhanceSingleTask } from '$lib/transformers/task.transformer';
import { addNewTaskInStore, removeTaskFromStore, updateTask } from '$lib/store/kanbanBoard.store';
import APPWRITE_CONST from '$constants/appwrite.constants';
import { db } from './client';

const { KRELLO_DB_ID, STATUS_COLLECTION_ID } = APPWRITE_CONST;

// HANLDE EVENTS
export const hanldeTaskCreateEvent = async (task: any, currentBoardId: string): Promise<void> => {
	// check if task is of current board
	if (currentBoardId !== task.boardId) {
		return;
	}

	// FIXME: remove this API CALL
	const statusDoc = await db.listDocuments(KRELLO_DB_ID, STATUS_COLLECTION_ID);
	const enhancedTask = enhanceSingleTask(task, statusDoc.documents);
	addNewTaskInStore(enhancedTask);
};

export const hanldeTaskUpdateEvent = async (task: any, currentBoardId: string): Promise<void> => {
	// check if task is of current board
	if (currentBoardId !== task.boardId) {
		return;
	}

	// FIXME: remove this API CALL
	const statusDoc = await db.listDocuments(KRELLO_DB_ID, STATUS_COLLECTION_ID);
	const enhancedTask = enhanceSingleTask(task, statusDoc.documents);

	updateTask(enhancedTask);
};

export const hanldeTaskDeleteEvent = async (task: any, currentBoardId: string): Promise<void> => {
	// check if task is of current board
	if (currentBoardId !== task.boardId) {
		return;
	}

	removeTaskFromStore(task);
};

// comments hanlders;
