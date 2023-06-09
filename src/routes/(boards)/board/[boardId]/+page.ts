import APPWRITE_CONST from '$lib/constants/appwrite.constants';
import { db } from '$lib/api/appwrite/client';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

type ReturnType = {
	boardId: string;
	boardDoc: any;
	labels: any;
};

export const load = (async ({ params }): Promise<ReturnType> => {
	const { KRELLO_DB_ID, BOARDS_COLLECTION_ID, LABELS_COLLECTION_ID } = APPWRITE_CONST;
	try {
		const [boardDoc, labels] = await Promise.all([
			db.getDocument(KRELLO_DB_ID, BOARDS_COLLECTION_ID, params.boardId),
			db.listDocuments(KRELLO_DB_ID, LABELS_COLLECTION_ID),
		]);

		return {
			boardId: params.boardId,
			boardDoc,
			labels: labels.documents,
		};
	} catch (e) {
		throw error(404, 'No Board Found');
	}
}) satisfies PageLoad;
