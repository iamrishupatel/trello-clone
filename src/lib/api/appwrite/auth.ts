import type { CreateAccountFormValues, LoginFormValues } from '$types/formValues';
import { account, db } from './client';
import { authStore } from '$store';
import { goto } from '$app/navigation';
import { initialAuthStore } from '$store/auth.store';
import { AuthStatus } from '$enums/AuthStatus.enums';
import APPWRITE_CONST from '$constants/appwrite.constants';
import { v4 as uuidv4 } from 'uuid';
import TEXT from '$constants/text.constants';
import ROUTES from '$constants/routes.constants';
import { APP_URL } from '$constants/app.constans';
import toast from 'svelte-french-toast';
import ERROR_TYPES from '$constants/error.constants';

export const createAccount = async (values: CreateAccountFormValues): Promise<void> => {
	/**
	 * 1. ceate an account
	 * 2. create a new document for user
	 * 3. log the user into plantform
	 */
	try {
		authStore.update(() => ({
			...initialAuthStore,
			authStatus: AuthStatus.IN_PROGRESS,
		}));
		const userId = uuidv4();

		// create a new account
		await account.create(userId, values.email, values.password, values.name);

		// account created successfully
		// add the user to db
		await db.createDocument(
			APPWRITE_CONST.KRELLO_DB_ID,
			APPWRITE_CONST.USER_COLLECTION_ID,
			userId,
			{
				name: values.name,
				displayPicture: '',
				username: values.email.split('@')[0],
				bio: '',
				email: values.email,
			},
		);

		// user doc created successfully
		// now login the user
		const sessionData = await account.createEmailSession(values.email, values.password);

		// auth successful
		// add data to store.
		authStore.set({
			isAuthenticated: true,
			sessionId: sessionData.$id,
			authStatus: AuthStatus.SUCCESS,

			userDetails: {
				id: sessionData.userId,
				bio: '',
				displayPicture: '',
				email: values.email,
				phone: '',
				name: values.name,
				username: values.email.split('@'),
			},
		});

		await goto(ROUTES.HOME); // FIXME: CHECK THIS TO FIX REDIRECT ISSUE
	} catch (e: any) {
		// handle user already exists error

		if (e.type === 'user_already_exists') {
			authStore.set({
				...initialAuthStore,
				authStatus: AuthStatus.FAILED,
				authErrorMessage: TEXT.ERROR_MESSAGES.USER_ALREADY_EXISTS,
			});
		} else {
			authStore.set({
				...initialAuthStore,
				authStatus: AuthStatus.FAILED,
				authErrorMessage: e.message,
			});
		}
	}
};

export async function handleEmailPasswordLogin(values: LoginFormValues): Promise<void> {
	try {
		authStore.update(() => ({
			...initialAuthStore,
			authStatus: AuthStatus.IN_PROGRESS,
		}));

		const session = await account.createEmailSession(values.email, values.password);
		const userData = await account.get();

		// get other users info from db
		const userDoc = await db.getDocument(
			APPWRITE_CONST.KRELLO_DB_ID,
			APPWRITE_CONST.USER_COLLECTION_ID,
			userData.$id,
		);

		authStore.set({
			isAuthenticated: true,
			sessionId: session.$id,
			authStatus: AuthStatus.SUCCESS,
			userDetails: {
				// take from the get accout api
				id: userData.$id,
				email: userData.email,
				phone: userData.phone,
				name: userData.name,

				// taken from the db
				username: userDoc.username,
				bio: userDoc.bio,
				displayPicture: userDoc.displayPicture,
			},
		});

		await goto(ROUTES.HOME);
	} catch (e: any) {
		console.log(e);
		authStore.set({
			...initialAuthStore,
			authStatus: AuthStatus.FAILED,
			authErrorMessage: e.message as string,
		});
	}
}

export async function createAnonSession(): Promise<void> {
	try {
		authStore.set({
			...initialAuthStore,
			authStatus: AuthStatus.ANON_AUTH_IN_PROGRESS,
		});

		const anonSession = await account.createAnonymousSession();
		authStore.set({
			isAuthenticated: true,
			sessionId: anonSession.$id,
			authStatus: AuthStatus.SUCCESS,
			isAnonymous: true,
			userDetails: {
				id: anonSession.$id,
				displayPicture: '',
				email: 'anonymous',
				phone: '',
				name: 'Anonymous',
				bio: TEXT.ANON_USER_BIO,
				username: 'anonymous',
			},
		});

		await goto(ROUTES.HOME);
	} catch (e: any) {
		authStore.set({
			...initialAuthStore,
			authStatus: AuthStatus.FAILED,
			authErrorMessage: e.message,
		});
	}
}

export const handleSignout = async (sessionId: string): Promise<void> => {
	try {
		authStore.set(initialAuthStore);
		await account.deleteSession(sessionId);
		await goto(ROUTES.LOGIN);
	} catch (e) {
		console.log(e);
	}
};

export const handleResetPassword = async (email: string): Promise<void> => {
	try {
		const res = await account.createRecovery(email, `${APP_URL}/reset-password`);
		console.log(res);
		toast.success('Link sent successfully. Please check your email');
	} catch (e: any) {
		console.error(e.message);
		if (e.code === 429) {
			toast.error('Too many requst! Please try again later');
			return;
		}

		if (e.type === ERROR_TYPES.USER_NOT_FOUND) {
			toast.error('Email not found. Please make sure you entered the correct email address.');
			return;
		} else {
			toast.error('Oops! Something went wrong. Please try again later.');
			return;
		}
	}
};

export const updatePassword = async (
	userId: string,
	secret: string,
	password: string,
	confirmPasword: string,
): Promise<void> => {
	try {
		await account.updateRecovery(userId, secret, password, confirmPasword);
		goto(`${ROUTES.LOGIN}?source=${ROUTES.RESET_PASSWORD}`);
	} catch (e: any) {
		console.log(e);
		if (e.code === 429) {
			toast.error('Too many requst! Please try again later');
			return;
		}

		if (e.type === ERROR_TYPES.USER_INVALID_TOKEN) {
			toast.error('Link expired. Request a new one.');
			return;
		}
		if (e.type === ERROR_TYPES.USER_NOT_FOUND) {
			toast.error('Email not found. Please make sure you entered the correct email address.');
			return;
		} else {
			toast.error('Oops! Something went wrong. Please try again later.');
			return;
		}
	}
};
