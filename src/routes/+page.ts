import { DEFAULT_BOARDS_PAGINATION_LIMIT } from '$constants/app.constans';
import { getAllBoards } from '$lib/api/appwrite/boards.api';
import { authStore } from '$lib/store';
import boardStore from '$lib/store/boards.store';
import type { AuthState } from '$types/authStore';
import type { Board } from '$types/board';
import type { PageLoad } from './$types';

type ReturnType = {
	boards: Board[];
};

export const load = loadPageData satisfies PageLoad;

async function loadPageData(): Promise<ReturnType> {
	let boards: Board[] = [];
	let userId = '';

	authStore.subscribe((auth: AuthState) => {
		userId = auth.userDetails?.id as string;
	});

	try {
		boards = await getAllBoards(userId, '', DEFAULT_BOARDS_PAGINATION_LIMIT);
		boardStore.update((prevState) => ({
			...prevState,
			boards: boards,
			isCreateBoardModalOpen: false,
		}));
	} catch (e) {
		// handle Errors
		console.log('ee');
	}

	return {
		boards: boards,
	};
}
