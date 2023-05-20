import type { Board, BoardCreationPayload, BoardMember, NewBoardFormData } from '$types/board';
import { db, storage } from './client';
import { v4 as uuidv4 } from 'uuid';
import APPWRITE_CONST from '$constants/appwrite.constants';
import { Query } from 'appwrite';
import boardStore from '$lib/store/boards.store';
import toast from 'svelte-french-toast';
import { authStore } from '$lib/store';
import type { AuthState, UserDetails } from '$types/authStore';

type CreateNewBoard = (
	data: NewBoardFormData,
	isAnonymous: boolean,
	hanldeFormReset: () => void,
) => Promise<void>;

export const createNewBoard: CreateNewBoard = async (data, isAnonymous, hanldeFormReset) => {
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
				},
			);
		}

		console.log(boardDoc);
		console.log(boardDoc.coverURL);

		// update the store with new board
		const newBoard: Board = {
			id: boardDoc.$id,
			coverURL: boardDoc.coverURL,
			name: boardDoc.name,
			owner: boardDoc.owner,
			members: [],
			isPrivate: boardDoc.isPrivate,
		};

		if (!isAnonymous && userDoc) {
			newBoard.members.push({
				name: userDoc.name,
				displayPicture: userDoc.displayPicture,
				email: userDoc.email,
				id: userDoc.$id,
			});
		}

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

export const getAllBoards = async (userId: string): Promise<Board[]> => {
	// TODO: once the appwrite cloud starts using v.1.3.x IMPLEMENT RELATIONS

	// Return all the boards which satisfies the given criteria
	// 1. Board can be public or
	// 2. Board can be private and logged in user is a member of the board

	// STEP 1. fetch all the boards
	const { documents } = await db.listDocuments(
		APPWRITE_CONST.KRELLO_DB_ID,
		APPWRITE_CONST.BOARDS_COLLECTION_ID,
		[Query.orderDesc('$createdAt')],
	);

	// STEP 2. filter the boards
	// which are not public or owned by the logged in user
	const filteredDocs = documents.filter((item): boolean => {
		return item.members.includes(userId) || !item.isPrivate;
	});

	// POPULATE THE USER DATA IN MEMBER
	// realations pending...
	return await Promise.all(filteredDocs.map(populateMemberDataInBoard));
};

const populateMemberDataInBoard = async (board: any): Promise<Board> => {
	let user: UserDetails | null = null;

	authStore.subscribe((authStore: AuthState) => {
		user = authStore.userDetails;
	});

	const boardData: Board = {
		id: board.$id,
		coverURL: board.coverURL,
		name: board.name,
		owner: board.owner,
		members: [],
		isPrivate: board.isPrivate,
		labels: [],
	};

	boardData.labels?.push({
		color: board.isPrivate ? 'red' : 'green',
		id: '1',
		text: board.isPrivate ? 'Private Board' : 'Public Board',
	});

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (user && board.owner === user.id) {
		boardData.labels?.push({
			color: 'indigo',
			id: 'my-board',
			text: 'My Board',
		});
	}

	try {
		const membersListWithTheirData = await Promise.all(
			board.members.map(async (member: string) => {
				const [isAnon, memberData] = await getBoardMemberData(member);
				return isAnon ? null : memberData;
			}),
		);

		boardData.members = membersListWithTheirData.filter((mem) => {
			if (mem) return true;
			return false;
		}) as BoardMember[];
	} catch (e) {
		console.error(e);
	}

	return boardData;
};

const getBoardMemberData = async (userId: string): Promise<[boolean, BoardMember | null]> => {
	let memberData: BoardMember;
	try {
		const { $id, name, email, displayPicture } = await db.getDocument(
			APPWRITE_CONST.KRELLO_DB_ID,
			APPWRITE_CONST.USER_COLLECTION_ID,
			userId, // user id is same as doc id
			[Query.select(['name', 'email', 'displayPicture'])],
		);

		memberData = {
			id: $id,
			name,
			email,
			displayPicture,
		};

		return [false, memberData];
	} catch (e) {
		console.log(e);
		// If the member doc is not found
		// i.e. the member is anonymous user
		return [true, null];
	}
};

// INTERNAL HELPERS
const uploadBoardCover = async (file: File): Promise<string> => {
	const fileId = uuidv4();
	await storage.createFile(APPWRITE_CONST.BOARDS_BUCKET_ID, fileId, file);

	const result = storage.getFilePreview(APPWRITE_CONST.BOARDS_BUCKET_ID, fileId);

	return result.href;
};
