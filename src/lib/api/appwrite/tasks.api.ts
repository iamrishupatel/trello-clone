import APPWRITE_CONST from '$constants/appwrite.constants';
import type { KanbanBoardData, TaskCreationPayload } from '$types/kanban';
import { db, storage } from './client';
import { v4 as uuidv4 } from 'uuid';
import toast from 'svelte-french-toast';
import { enhanceTasksData } from '$transformers/task.transformer';
import { generateKanbanBoardFromTasks } from '$factories/kanban.factories';
import type { CreateNewTasksFormValues } from '$types/formValues';
import type { CardLabel } from '$types/card';
import type { AppwriteApiError } from '$lib/types/error.types';
import ERROR_TYPES from '$lib/constants/error.constants';
import { Query } from 'appwrite';

// CONSTANTS USED
const { KRELLO_DB_ID, TASK_COLLECTION_ID, STATUS_COLLECTION_ID, BOARDS_COLLECTION_ID } =
	APPWRITE_CONST;

export const getkanbanBoard = async (currentBoardId: string): Promise<KanbanBoardData> => {
	const [statusDoc, taskDocs] = await Promise.all([
		db.listDocuments(KRELLO_DB_ID, STATUS_COLLECTION_ID),
		db.listDocuments(KRELLO_DB_ID, TASK_COLLECTION_ID, [
			Query.equal('boardId', currentBoardId),
			Query.limit(100), // FIXME: what if more than 100 task
			// add paginations
		]),
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
		//before anything check if current user has the permissions
		// to create any new tasks in the given board
		await db.getDocument(KRELLO_DB_ID, BOARDS_COLLECTION_ID, boardId);

		let coverUrl;

		if (typeof formValues.file === 'string') {
			coverUrl = formValues.file;
		} else {
			coverUrl = await uploadCoverPicture(formValues.file);
		}

		const taskDocId = uuidv4();
		const payload: TaskCreationPayload = {
			boardId,
			title: formValues.title,
			status: formValues.statusId,
			prevStatusId: formValues.statusId,
			labels: formValues.labels.map((label) => label.id),
			description: formValues.description,
		};

		if (coverUrl) {
			payload['coverUrl'] = coverUrl;
		}

		if (formValues.priorityId) {
			payload['priority'] = formValues.priorityId;
		}

		await db.createDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskDocId, payload);
		toast.success('Task created successfully');
		// TODO: after task is created add it to store
		// and hanlde the create event for this as well
	} catch (error: any) {
		const e = error as AppwriteApiError;
		console.error(e);
		if (e.type === ERROR_TYPES.DOCUMENT_NOT_FOUND) {
			// the document does not exist
			// ie. current user does not have permission to even fetch the document
			// show the access denied error message
			toast.error('Access denied');
			location.reload();
		} else {
			toast.error(e.message);
		}
	}
};

export const updateTaskStatus = async (
	taskId: string,
	statusId: string,
	prevStatusId: string,
	boardId: string | undefined,
): Promise<void> => {
	if (!boardId) return;
	try {
		await checkForBoardAccess(boardId);
		await db.updateDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskId, {
			status: statusId,
			prevStatusId,
		});
	} catch (e) {
		const error = e as AppwriteApiError;
		// FIXME: handle errors
		// remove permissions to mimic errors
		toast.error(error.message);
		console.log(error);
	}
};

export const updateTaskTitle = async (
	taskId: string,
	taskTitle: string,
	boardId: string,
	prevStatusId: string,
): Promise<void> => {
	try {
		await checkForBoardAccess(boardId);
		await db.updateDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskId, {
			title: taskTitle,
			prevStatusId,
		});
	} catch (e: any) {
		console.error(e);
		toast.error(e.message);
	}
};

export const updateTaskPriority = async (
	taskId: string,
	priority: string,
	boardId: string,
	prevStatusId: string,
): Promise<void> => {
	try {
		await checkForBoardAccess(boardId);
		await db.updateDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskId, {
			priority,
			prevStatusId,
		});
	} catch (e: any) {
		console.error(e);
		toast.error(e.message);
	}
};

export const updateTaskDescription = async (
	taskId: string,
	description: string,
	boardId: string,
	prevStatusId: string,
): Promise<void> => {
	try {
		await checkForBoardAccess(boardId);
		await db.updateDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskId, {
			description,
			prevStatusId,
		});
		toast.success('Task description updated successfully');
	} catch (e) {
		toast.error('Unable to update task description');
		console.error(e);
	}
};

export const addLabelInTask = async (
	taskId: string,
	newLabelId: string,
	labels: CardLabel[],
	boardId: string,
	prevStatusId: string,
): Promise<void> => {
	try {
		await checkForBoardAccess(boardId);
		await db.updateDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskId, {
			labels: [...labels.map((label) => label.id), newLabelId],
			prevStatusId,
		});
		toast.success('Task updated successfully');
	} catch (e) {
		toast.error('Unable to update task label');
		console.error(e);
	}
};

export const removeLabelInTask = async (
	taskId: string,
	removedLabelId: string,
	labels: CardLabel[],
	boardId: string,
	prevStatusId: string,
): Promise<void> => {
	try {
		await checkForBoardAccess(boardId);
		await db.updateDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskId, {
			labels: labels.filter((oldLabel) => oldLabel.id !== removedLabelId).map((label) => label.id),
			prevStatusId,
		});
		toast.success('Task updated successfully');
	} catch (e) {
		toast.error('Unable to update task label');
		console.error(e);
	}
};

export const updateTaskCoverUrl = async (
	taskDocId: string,
	cover: string | File,
	boardId: string,
	prevStatusId: string,
): Promise<string> => {
	await checkForBoardAccess(boardId);
	let coverUrl;
	if (typeof cover === 'string') {
		coverUrl = cover;
	} else {
		coverUrl = await uploadCoverPicture(cover);
	}

	await db.updateDocument(KRELLO_DB_ID, TASK_COLLECTION_ID, taskDocId, {
		coverUrl,
		prevStatusId,
	});
	return coverUrl;
};

// might be refactored
const uploadCoverPicture = async (file: File): Promise<string> => {
	const fileId = uuidv4();
	await storage.createFile(APPWRITE_CONST.TASKS_BUCKED_ID, fileId, file);

	const result = storage.getFilePreview(APPWRITE_CONST.TASKS_BUCKED_ID, fileId);

	return result.href;
};

// this function checks if the current user can access the
// the given board.
// if the user has read access then procceed else reload the page.
const checkForBoardAccess = async (boardId: string): Promise<void> => {
	// let currentBoard: Board;
	// boardStore.subscribe((store) => {
	// 	currentBoard = store.currentBoard as Board;
	// });
	try {
		await db.getDocument(KRELLO_DB_ID, BOARDS_COLLECTION_ID, boardId);
	} catch (error: any) {
		const e = error as AppwriteApiError;
		console.error(e);
		if (e.type === ERROR_TYPES.DOCUMENT_NOT_FOUND) {
			// the document does not exist
			// ie. current user does not have permission to even fetch the document
			// show the access denied error message
			toast.error('Access denied');
			location.reload();
		} else {
			toast.error(e.message);
		}
		throw new Error(error);
	}
};
