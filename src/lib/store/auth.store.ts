import { browser } from '$app/environment';
import { AuthStatus } from '$enums/AuthStatus.enums';
import type { AuthState } from '$types/authStore';
import { writable } from 'svelte/store';

export const initialAuthStore: AuthState = {
	authStatus: AuthStatus.NOT_STARTED,
	isAnonymous: false,
	isAuthenticated: false,
	userDetails: null,
	sessionId: null,
	authErrorMessage: null,
};

const storedState = browser && localStorage.getItem('authState');

const authStore = writable(JSON.parse(storedState as string) || initialAuthStore);

// any time the store chnages update the local storage
authStore.subscribe((value) => {
	if (browser) {
		localStorage.setItem('authState', JSON.stringify(value));
	}
});

export default authStore;
