export type NewBoardFormData = {
	file: File | '';
	name: string;
	isPrivate: boolean;
	owner: string;
};

export type Board = {
	id: string;
	coverURL?: string;
	name: string;
	owner: string;
	members: Array<BoardMember>;
	isPrivate: boolean;
};

export type BoardMember = {
	name: string;
	displayPicture: string;
	email: string;
	id: string;
};

export type BoardStore = {
	boards: Board[];
	isCreateBoardModalOpen: boolean;
};

export type BoardCreationPayload = {
	members: string[];
	name: string;
	owner: string;
	isPrivate: boolean;
	coverURL?: string;
};
