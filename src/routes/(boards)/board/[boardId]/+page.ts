import APPWRITE_CONST from '$constants/appwrite.constants';
import { db } from '$lib/api/appwrite/client';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

type ReturnType = {
	boardId: string;
	boardDoc: any;
};

export const load = (async ({ params }): Promise<ReturnType> => {
	try {
		const boardDoc = await db.getDocument(
			APPWRITE_CONST.KRELLO_DB_ID,
			APPWRITE_CONST.BOARDS_COLLECTION_ID,
			params.boardId,
		);
		return {
			boardId: params.boardId,
			boardDoc,
		};
	} catch (e) {
		throw error(404, 'No Board Found');
	}
}) satisfies PageLoad;
