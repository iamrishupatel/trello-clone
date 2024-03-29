import type { CardLabel } from './card';
import type { User } from './user';

export type NewBoardFormData = {
	file: File | '';
	name: string;
	isPrivate: boolean;
	owner: string;
	email: string;
};

export type Board = {
	id: string;
	coverURL?: string;
	name: string;
	owner: User;
	members: Array<BoardMember>;
	isPrivate: boolean;
	labels?: CardLabel[];
	description: string;
	createdAt: string;
	teamId: string;
};

export type BoardMember = User & {
	membershipId: string;
};

export type BoardStore = {
	boards: Board[];
	isCreateBoardModalOpen: boolean;
	currentBoard: Board | null;
	labels: CardLabel[];
};

export type BoardCreationPayload = {
	members: string[];
	name: string;
	owner: string;
	isPrivate: boolean;
	coverURL?: string;
	description: string;
	teamId: string;
};

export type CreateNewBoardFunc = (
	data: NewBoardFormData,
	isAnonymous: boolean,
	hanldeFormReset: () => void,
) => Promise<void>;

export type GetAllBoardFun = (userId: string, lastId?: string, limit?: number) => Promise<Board[]>;
