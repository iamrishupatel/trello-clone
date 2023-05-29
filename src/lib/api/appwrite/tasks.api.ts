import APPWRITE_CONST from '$constants/appwrite.constants';
import type { KanbanBoardData, TaskCreationPayload } from '$types/kanban';
import { faker } from '@faker-js/faker';
import { db } from './client';
import { v4 as uuidv4 } from 'uuid';
import toast from 'svelte-french-toast';
import { enhanceTasksData } from '$lib/transformers/task.transformer';
import { generateKanbanBoardFromTasks } from '$lib/factories/kanban.factories';

// CONSTANTS USED
const { KRELLO_DB_ID, TASK_COLLECTION_ID, STATUS_COLLECTION_ID } = APPWRITE_CONST;

export const getkanbanBoard = async (currentBoardId: string): Promise<KanbanBoardData> => {
	const [statusDoc, taskDocs] = await Promise.all([
		db.listDocuments(KRELLO_DB_ID, STATUS_COLLECTION_ID),
		db.listDocuments(KRELLO_DB_ID, TASK_COLLECTION_ID),
	]);

	const tasks = taskDocs.documents.filter((task) => task.boardId === currentBoardId);

	const enhancedTasks = enhanceTasksData(tasks, statusDoc.documents);
	return generateKanbanBoardFromTasks(enhancedTasks, statusDoc.documents);
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
