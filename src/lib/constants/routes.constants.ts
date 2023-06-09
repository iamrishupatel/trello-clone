export const AUTH_ROUTES = Object.freeze({
	LOGIN: '/login',
	REGISTER: '/register',
	RESET_PASSWORD: '/reset-password',
});

export const PROTECTED_ROUTES = Object.freeze({
	HOME: '/',
	MY_PROFILE: '/me',
	EDIT_PROFILE: '/me/edit',
});

const ROUTES = Object.freeze({
	...AUTH_ROUTES,
	...PROTECTED_ROUTES,
});

export default ROUTES;
