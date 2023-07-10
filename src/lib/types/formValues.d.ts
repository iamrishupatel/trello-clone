import type { CardLabel } from './card';

export type CreateAccountFormValues = {
	name: string;
	password: string;
	email: string;
};

export type LoginFormValues = {
	password: string;
	email: string;
};

export type EditProfileValues = {
	id: string;
	name: string;
	bio: string;
	phone: string;
	email: string;
	displayPicture: null | File;
};

export type BoardDescriptionFormValues = {
	id: string;
	description: string;
	textContent: string;
};

export type CreateNewTasksFormValues = {
	title: string;
	description: string;
	statusId: string;
	file: string | File;
	labels: CardLabel[];
	priorityId: string;
};

export type CreateNewLabelFormValues = {
	text: string;
	color: string;
};

export type CreateCommentFormValues = {
	body: string;
	_bodyText: string;
	authorId: string;
};
