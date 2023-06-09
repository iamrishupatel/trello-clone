import type { Models } from 'appwrite';

export type CommentDoc = Models.Document & {
	body: string;
	author: string;
	taskId: string;
	isEdited: boolean;
};
