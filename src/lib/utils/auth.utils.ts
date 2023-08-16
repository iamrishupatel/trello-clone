import { goto } from '$app/navigation';
import ROUTES from '$lib/constants/routes.constants';
import type { AuthState } from '$lib/types/authStore';

export const redirectToHomeIfLoggedIn = (): void => {
	const authState: AuthState = JSON.parse(localStorage.getItem('authState') as string);
	if (authState.isAuthenticated) {
		goto(ROUTES.HOME);
	}
};
