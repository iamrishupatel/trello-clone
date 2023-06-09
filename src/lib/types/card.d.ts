export type CardLabel = {
	text: string;
	id: string;
	color:
		| 'red'
		| 'yellow'
		| 'green'
		| 'indigo'
		| 'purple'
		| 'pink'
		| 'blue'
		| 'dark'
		| 'none'
		| undefined;
};

export type CardUserData = {
	name: string;
	displayPicture: string;
	email: string;
	id: string;
};
