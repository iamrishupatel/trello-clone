import type {
	Board,
	BoardCreationPayload,
	BoardStore,
	CreateNewBoardFunc,
	GetAllBoardFun,
} from '$types/board';
import { db, storage, teams } from './client';
import { v4 as uuidv4 } from 'uuid';
import APPWRITE_CONST from '$constants/appwrite.constants';
import { Permission, Query, Role, type Models } from 'appwrite';
import boardStore from '$store/boards.store';
import toast from 'svelte-french-toast';
import type { BoardDescriptionFormValues } from '$types/formValues';
import TEXT from '$constants/text.constants';
import { getBulkUserData } from './userDetails.api';
import { enhanceBoardData } from '$transformers/board.transformer';
import { APP_URL } from '$lib/constants/app.constans';

const { KRELLO_DB_ID, BOARDS_COLLECTION_ID } = APPWRITE_CONST;

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
			teamId: '', // this should be updated when a new team is created in this process
		};

		const permissions: string[] = [];
		if (boardCreationPayload.isPrivate) {
			// create a new team;
			// FIXME: fix this and promp user and ask for name.
			// or we can use the existing teams of the user
			const teamId = uuidv4();
			await teams.create(teamId, `${boardCreationPayload.name.substring(0, 90)}'s TEAM`);

			// update the team Id in the board creation payload
			boardCreationPayload.teamId = teamId;

			permissions.push(Permission.read(Role.team(teamId)));
			permissions.push(Permission.update(Role.team(teamId)));
			permissions.push(Permission.delete(Role.user(data.owner)));
		} else {
			permissions.push(Permission.read('any'));
			permissions.push(Permission.update('any'));
		}

		// Create a new board document
		const boardDoc = await db.createDocument(
			APPWRITE_CONST.KRELLO_DB_ID,
			APPWRITE_CONST.BOARDS_COLLECTION_ID,
			docId,
			boardCreationPayload,
			permissions,
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
			teamId: boardDoc.teamId,
		};

		if (!isAnonymous && userDoc) {
			newBoard.members.push({
				name: userDoc.name,
				displayPicture: userDoc.displayPicture,
				email: userDoc.email,
				id: userDoc.$id,
				membershipId: '', // TODO:
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

	// transform the boars data return it.
	const data: Board[] = documents.map((doc: any) => enhanceBoardData(doc, bulkUsers));

	return data;
};

export const getBoardData = async (boardId: string): Promise<Board> => {
	const [boardDoc, bulkUsers] = await Promise.all([
		db.getDocument(APPWRITE_CONST.KRELLO_DB_ID, APPWRITE_CONST.BOARDS_COLLECTION_ID, boardId),
		getBulkUserData(),
	]);

	let memberships: Models.Membership[] = [];
	if (boardDoc.isPrivate) {
		memberships = (await teams.listMemberships(boardDoc.teamId, [Query.equal('confirm', true)]))
			.memberships;
	}

	const boardData = enhanceBoardData(boardDoc, bulkUsers, memberships);

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

export const updateBoardPrivacy = async (board: Board, isPrivate: boolean): Promise<void> => {
	// if we are marking this as private
	// then only a certail Team
	//  should have read and update permissions

	if (isPrivate) {
		//if there is no team then create a new team
		const teamId = board.teamId ? board.teamId : uuidv4();
		if (!board.teamId) {
			await teams.create(teamId, `${board.name.substring(0, 90)}'s TEAM`);
		}

		await db.updateDocument(
			KRELLO_DB_ID,
			BOARDS_COLLECTION_ID,
			board.id,
			{
				isPrivate: true,
				teamId,
			},
			[Permission.read(Role.team(teamId)), Permission.update(Role.team(teamId))],
		);
	} else {
		//make it public
		await db.updateDocument(
			KRELLO_DB_ID,
			BOARDS_COLLECTION_ID,
			board.id,
			{
				isPrivate: false,
			},
			[Permission.read('any'), Permission.update('any')],
		);
	}
};

export const inviteUserToBoard = async (board: Board, newMemberEmail: string): Promise<void> => {
	const redirectURL = `${APP_URL}/board/`;
	await teams.createMembership(board.teamId, ['member'], redirectURL, newMemberEmail);
};

export const removeMemberFromBoard = async (
	teamId: string,
	membershipId: string,
): Promise<void> => {
	await teams.deleteMembership(teamId, membershipId);
};
