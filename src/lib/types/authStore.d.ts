export type AuthState = {
	isAuthenticated: boolean;
	isAnonymous: boolean;
	authStatus: AuthStatus;
	userDetails: UserDetails | null;
	sessionId: string | null;
	authErrorMessage: string | null;
};

export type UserDetails = {
	id: string;
	name: string;
	bio: string;
	phone: string;
	email: string;
	displayPicture: string;
	username: string;
};
