import APPWRITE_CONST from '$constants/appwrite.constants';
import type { CreateCommentFormValues } from '$types/formValues';
import type { CommentCreationPayload, CommentType } from '$types/kanban';
import { Permission, Query } from 'appwrite';
import { db } from './client';
import { v4 as uuidv4 } from 'uuid';
import { getBulkUserData } from './userDetails.api';
import type { User } from '$types/user';

const { KRELLO_DB_ID, COMMENTS_COLLECTION_ID } = APPWRITE_CONST;

const getAuthor = (id: string, bulkUser: User[]): User => {
	const userData = bulkUser.find((user) => user.id === id);
	if (userData) return userData;

	return {
		isAnonymous: true,
		displayPicture: '',
		email: 'anonymous@rlabs.dev',
		id: uuidv4(),
		name: 'Anonymous User',
	};
};

export const createNewComment = async (
	taskId: string,
	formValues: CreateCommentFormValues,
	isAnonymous: boolean,
): Promise<void> => {
	const docId = uuidv4();

	const payload: CommentCreationPayload = {
		body: formValues.body,
		author: formValues.authorId,
		taskId,
		isEdited: false,
	};

	if (!isAnonymous) {
		await db.createDocument(KRELLO_DB_ID, COMMENTS_COLLECTION_ID, docId, payload);
	} else {
		await db.createDocument(KRELLO_DB_ID, COMMENTS_COLLECTION_ID, docId, payload, [
			Permission.read('any'),
			Permission.update('any'),
			Permission.delete('any'),
		]);
	}
};

export const getComments = async (taskId: string): Promise<CommentType[]> => {
	const [bulkUsers, res] = await Promise.all([
		getBulkUserData(),
		db.listDocuments(KRELLO_DB_ID, COMMENTS_COLLECTION_ID, [
			Query.equal('taskId', taskId),
			Query.orderDesc('$createdAt'),
		]),
	]);

	return res.documents.map((doc) => ({
		id: doc.$id,
		body: doc.body,
		createdAt: doc.$createdAt,
		author: getAuthor(doc.author, bulkUsers),
		isEdited: doc.isEdited,
	}));
};

export const deleteComment = async (commentId: string): Promise<void> => {
	await db.deleteDocument(KRELLO_DB_ID, COMMENTS_COLLECTION_ID, commentId);
};

export const updateComment = async (commentId: string, commentBody: string): Promise<void> => {
	await db.updateDocument(KRELLO_DB_ID, COMMENTS_COLLECTION_ID, commentId, {
		body: commentBody,
		isEdited: true,
	});
};
