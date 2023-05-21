import type {
	Board,
	BoardCreationPayload,
	BoardStore,
	CreateNewBoardFunc,
	GetAllBoardFun,
} from '$types/board';
import { db, storage } from './client';
import { v4 as uuidv4 } from 'uuid';
import APPWRITE_CONST from '$constants/appwrite.constants';
import { Query } from 'appwrite';
import boardStore from '$lib/store/boards.store';
import toast from 'svelte-french-toast';
import type { BoardDescriptionFormValues } from '$types/formValues';
import TEXT from '$constants/text.constants';
import { getBulkUserData } from './userDetails.api';
import { enhanceBoardData } from '$lib/transformers/board.transformer';

const uploadBoardCover = async (file: File): Promise<string> => {
	const fileId = uuidv4();
	await storage.createFile(APPWRITE_CONST.BOARDS_BUCKET_ID, fileId, file);

	const result = storage.getFilePreview(APPWRITE_CONST.BOARDS_BUCKET_ID, fileId);

	return result.href;
};

export const createNewBoard: CreateNewBoardFunc = async (data, isAnonymous, hanldeFormReset) => {
	// TODO: once the appwrite cloud starts using v.1.3.x IMPLEMENT RELATIONS

	try {
		const { file } = data;

		const docId = uuidv4();
		let coverURL = '';

		// if file is here then upload the file to thhe bucket
		if (file) {
			coverURL = await uploadBoardCover(file);
		}

		const boardCreationPayload: BoardCreationPayload = {
			name: data.name,
			owner: isAnonymous ? '' : data.owner,
			isPrivate: isAnonymous ? false : data.isPrivate,
			members: isAnonymous ? [] : [data.owner],
			...(coverURL && { coverURL }),
			description: TEXT.DEFAULT_BOARD_DESCRIPTION,
		};

		// Create a new board document
		const boardDoc = await db.createDocument(
			APPWRITE_CONST.KRELLO_DB_ID,
			APPWRITE_CONST.BOARDS_COLLECTION_ID,
			docId,
			boardCreationPayload,
		);

		// add the board in the current users boards
		// if the user is not anonymous
		let userDoc;
		if (!isAnonymous) {
			userDoc = await db.updateDocument(
				APPWRITE_CONST.KRELLO_DB_ID,
				APPWRITE_CONST.USER_COLLECTION_ID,
				data.owner,
				{
					myBoards: [boardDoc.$id],
					email: data.email,
				},
			);
		}

		// update the store with new board
		const newBoard: Board = {
			id: boardDoc.$id,
			coverURL: boardDoc.coverURL,
			name: boardDoc.name,
			owner: boardDoc.owner,
			members: [],
			isPrivate: boardDoc.isPrivate,
			labels: [],
			description: '',
			createdAt: boardDoc.$createdAt,
		};

		if (!isAnonymous && userDoc) {
			newBoard.members.push({
				name: userDoc.name,
				displayPicture: userDoc.displayPicture,
				email: userDoc.email,
				id: userDoc.$id,
			});
			newBoard.labels?.push({
				color: 'indigo',
				id: 'my-board',
				text: 'My Board',
			});
		}

		// add labels
		newBoard.labels?.push({
			color: boardDoc.isPrivate ? 'red' : 'green',
			id: '1',
			text: boardDoc.isPrivate ? 'Private Board' : 'Public Board',
		});

		// update the board
		boardStore.update((prevState) => ({
			...prevState,
			boards: [newBoard, ...prevState.boards],
			isCreateBoardModalOpen: false,
		}));

		hanldeFormReset();

		// notify the user that board is created
		toast.success('New board created successfully!');
	} catch (e: any) {
		console.log(e);
		toast.error(e.message);
	}
};

export const getAllBoards: GetAllBoardFun = async (userId, lastId, limit) => {
	// TODO: once the appwrite cloud starts using v.1.3.x IMPLEMENT RELATIONS
	// Return all the boards which satisfies the given criteria
	// 1. Board can be public or
	// 2. Board can be private and logged in user is a member of the board

	const queries = [Query.orderDesc('$createdAt')];

	if (lastId) {
		queries.push(Query.cursorAfter(lastId));
	}

	if (limit) {
		queries.push(Query.limit(limit));
	}

	//  fetch all the boards
	const [{ documents }, bulkUsers] = await Promise.all([
		db.listDocuments(APPWRITE_CONST.KRELLO_DB_ID, APPWRITE_CONST.BOARDS_COLLECTION_ID, queries),
		getBulkUserData(),
	]);

	// filter the boards
	// which are not public or owned by the logged in user
	const filteredDocs = documents.filter((item): boolean => {
		return item.members.includes(userId) || !item.isPrivate;
	});

	// transform the boars data return it.
	const data: Board[] = filteredDocs.map((doc: any) => enhanceBoardData(doc, bulkUsers));

	return data;
};

export const getBoardData = async (boardId: string): Promise<Board> => {
	let boardData;
	try {
		const [boardDoc, bulkUsers] = await Promise.all([
			db.getDocument(APPWRITE_CONST.KRELLO_DB_ID, APPWRITE_CONST.BOARDS_COLLECTION_ID, boardId),
			getBulkUserData(),
		]);

		boardData = enhanceBoardData(boardDoc, bulkUsers);
	} catch (e) {
		console.error(e);
	}
	return boardData as Board;
};

export const updateBoardDescription = async (values: BoardDescriptionFormValues): Promise<void> => {
	const { description, id } = values;
	try {
		const updatedDoc = await db.updateDocument(
			APPWRITE_CONST.KRELLO_DB_ID,
			APPWRITE_CONST.BOARDS_COLLECTION_ID,
			id,
			{
				description,
			},
		);

		// update the board store
		boardStore.update((prevStore: BoardStore) => {
			if (prevStore.currentBoard) {
				return {
					...prevStore,
					currentBoard: {
						...prevStore.currentBoard,
						description: updatedDoc.description,
					},
				};
			}
			return prevStore;
		});
		toast.success('Descriptions updated successfully');
	} catch (e: any) {
		toast.error(e.message);
		console.log(e);
	}
};
