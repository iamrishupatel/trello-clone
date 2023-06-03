import APPWRITE_CONST from '$constants/appwrite.constants';
import type { KanbanBoardData, TaskCreationPayload } from '$types/kanban';
import { db, storage } from './client';
import { v4 as uuidv4 } from 'uuid';
import toast from 'svelte-french-toast';
import { enhanceTasksData } from '$lib/transformers/task.transformer';
import { generateKanbanBoardFromTasks } from '$lib/factories/kanban.factories';
import type { CreateNewTasksFormValues } from '$types/formValues';

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

export const createNewTask = async (
	boardId: string,
	formValues: CreateNewTasksFormValues,
): Promise<void> => {
	try {
		let coverUrl;

		if (typeof formValues.file === 'string') {
			coverUrl = formValues.file;
		} else {
			coverUrl = await uploadCoverPicture(formValues.file);
		}

		const { KRELLO_DB_ID, TASK_COLLECTION_ID } = APPWRITE_CONST;
		const taskDocId = uuidv4();
		const payload: TaskCreationPayload = {
			boardId,
			title: formValues.title,
			status: formValues.statusId,
			prevStatusId: formValues.statusId,
			labels: formValues.labels.map((label) => label.id),
			priority: formValues.priorityId,
		};

		if (coverUrl) {
			payload['coverUrl'] = coverUrl;
		}

		await db.createDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskDocId, payload);
		toast.success('Task created successfully');
		// TODO: after task is created add it to store
		// and hanlde the create event for this as well
	} catch (e: any) {
		console.error(e);
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

// might be refactored
const uploadCoverPicture = async (file: File): Promise<string> => {
	const fileId = uuidv4();
	await storage.createFile(APPWRITE_CONST.TASKS_BUCKED_ID, fileId, file);

	const result = storage.getFilePreview(APPWRITE_CONST.TASKS_BUCKED_ID, fileId);

	return result.href;
};
