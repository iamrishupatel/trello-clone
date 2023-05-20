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
};
