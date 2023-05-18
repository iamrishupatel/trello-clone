import type { Board, BoardMember, NewBoardFormData } from '$types/board';
import { faker } from '@faker-js/faker';
import { db, storage } from './client';
import { v4 as uuidv4 } from 'uuid';
import APPWRITE_CONST from '$constants/appwrite.constants';

export const createNewBoard = async (data: NewBoardFormData): Promise<void> => {
	console.log('incoming data', data);
	const { file } = data;

	const docId = uuidv4();
	let coverURL = '';
	if (file) {
		coverURL = await uploadBoardCover(file);
	}
	const boardData: Partial<Board> = {
		members: [],
		name: data.boardName,
		owner: data.owner,
		isPrivate: data.isPrivate,
		...(coverURL && { coverURL }),
	};

	await db.createDocument(
		APPWRITE_CONST.KRELLO_DB_ID,
		APPWRITE_CONST.BOARDS_COLLECTION_ID,
		docId,
		boardData,
	);
};

export const getAllBoards = async (): Promise<Board[]> => {
	const boards: Board[] = [];

	for (let i = 0; i < 5; i++) {
		const members: BoardMember[] = [];

		for (let j = 0; j < 5; j++) {
			members.push({
				displayPicture: faker.image.avatar(),
				name: faker.person.fullName(),
				id: faker.string.uuid(),
			});
		}

		const board: Board = {
			id: faker.string.uuid(),
			name: faker.lorem.sentence(),
			members,
			coverURL: faker.image.url(),
			owner: faker.string.uuid(),
			isPrivate: false,
		};

		boards.push(board);
	}

	return boards;
};

const uploadBoardCover = async (file: File): Promise<string> => {
	const fileId = uuidv4();
	await storage.createFile(APPWRITE_CONST.BOARDS_BUCKET_ID, fileId, file);

	const result = storage.getFilePreview(APPWRITE_CONST.BOARDS_BUCKET_ID, fileId);

	return result.href;
};
