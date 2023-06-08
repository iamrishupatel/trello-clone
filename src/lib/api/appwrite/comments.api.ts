import APPWRITE_CONST from '$constants/appwrite.constants';
import type { CreateCommentFormValues } from '$types/formValues';
import type { CommentCreationPayload, CommentType } from '$types/kanban';
import { Query } from 'appwrite';
import { db } from './client';
import { v4 as uuidv4 } from 'uuid';
import { getBulkUserData } from './userDetails.api';
import type { User } from '$types/user';

const { KRELLO_DB_ID, COMMENTS_COLLECTION_ID } = APPWRITE_CONST;

export const createNewComment = async (
	taskId: string,
	formValues: CreateCommentFormValues,
): Promise<void> => {
	const docId = uuidv4();

	const payload: CommentCreationPayload = {
		body: formValues.body,
		author: formValues.authorId,
		taskId,
	};

	await db.createDocument(KRELLO_DB_ID, COMMENTS_COLLECTION_ID, docId, payload);
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
	}));
};

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
