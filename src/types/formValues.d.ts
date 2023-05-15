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
	fullname: string;
	bio: string;
	phone: string;
	email: string;
	displayPicture: string;
};
