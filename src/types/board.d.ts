export type NewBoardFormData = {
	file: File | '';
	boardName: string;
	isPrivate: boolean;
	owner: string;
};

export type Board = {
	id: string;
	coverURL?: string;
	name: string;
	owner: string;
	members: Array<BoardMember>;
};

export type BoardMember = {
	name: string;
	displayPicture: string;
	id: string;
};
