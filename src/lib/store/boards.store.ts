import type { BoardStore } from '$types/board';
import { writable } from 'svelte/store';

export const initialBoardsStore: BoardStore = {
	boards: [],
	isCreateBoardModalOpen: false,
	currentBoard: null,
	labels: [],
};

const boardStore = writable(initialBoardsStore);

export default boardStore;
