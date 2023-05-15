import type { CreateAccountFormValues, LoginFormValues } from '$types/formValues';
import { ID } from 'appwrite';
import { account } from './client';
import { authStore } from '$lib/store';
import { goto } from '$app/navigation';
import { initialAuthStore } from '$lib/store/auth.store';
import { AuthStatus } from '$enums/AuthStatus.enums';

export const createAccount = async (values: CreateAccountFormValues): Promise<void> => {
	try {
		// create a new account
		await account.create(ID.unique(), values.email, values.password, values.name);

		// account created successfully
		// now login the user
		const res = await account.createEmailSession(values.email, values.password);

		// auth successful
		// add data to store.
		authStore.set({
			isAuthenticated: true,
			sessionId: res.$id,
			authStatus: AuthStatus.SUCCESS,

			userDetails: {
				id: res.userId,
				bio: '',
				displayPicture: '',
				email: values.email,
				phone: '',
				name: values.name,
			},
		});

		await goto('/');
	} catch (e) {
		console.log(e);
	}
};

export async function handleEmailPasswordLogin(values: LoginFormValues): Promise<void> {
	try {
		const session = await account.createEmailSession(values.email, values.password);
		const userData = await account.get();

		authStore.set({
			isAuthenticated: true,
			sessionId: session.$id,
			authStatus: AuthStatus.SUCCESS,
			userDetails: {
				id: userData.$id,
				bio: '',
				displayPicture: '',
				email: userData.email,
				phone: userData.phone,
				name: userData.name,
			},
		});

		await goto('/');
	} catch (e) {
		console.log(e);
	}
}

export async function createAnonSession(): Promise<void> {
	try {
		authStore.set({
			authStatus: AuthStatus.IN_PROGRESS,
		});

		const anonSession = await account.createAnonymousSession();
		authStore.set({
			isAuthenticated: true,
			sessionId: anonSession.$id,
			authStatus: AuthStatus.SUCCESS,
			isAnonymous: true,
			userDetails: {
				id: anonSession.$id,
				bio: '',
				displayPicture: '',
				email: 'anonymous',
				phone: '',
				name: 'Anonymous',
			},
		});

		await goto('/');
	} catch (e) {
		console.error(e);
	}
}

export const handleSignout = async (sessionId: string): Promise<void> => {
	try {
		await account.deleteSession(sessionId);
		authStore.set(initialAuthStore);
	} catch (e) {
		console.log(e);
	}
};