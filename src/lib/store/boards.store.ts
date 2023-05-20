import type { BoardStore } from '$types/board';
import { writable } from 'svelte/store';

export const initialBoardsStore: BoardStore = {
	boards: [],
	isCreateBoardModalOpen: false,
};

const boardStore = writable(initialBoardsStore);

export default boardStore;
