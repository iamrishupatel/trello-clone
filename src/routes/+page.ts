import { getAllBoards } from '$lib/api/appwrite/boards.api';
import type { Board } from '$types/board';
import type { PageLoad } from './$types';

type ReturnType = {
	boards: Board[];
};

export const load = loadPageData satisfies PageLoad;

async function loadPageData(): Promise<ReturnType> {
	const boards = await getAllBoards();

	return {
		boards: boards,
	};
}
