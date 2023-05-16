import type { EditProfileValues } from '$types/formValues';
import { account, db, storage } from './client';
import APPWRITE_CONST from '$constants/appwrite.constants';
import { v4 as uuidv4 } from 'uuid';
import { authStore } from '$lib/store';
import type { AuthState, UserDetails } from '$types/authStore';
import { goto } from '$app/navigation';
import ROUTES from '$constants/routes.constants';
import toast from 'svelte-french-toast';

export const updateUserDetails = async (values: EditProfileValues): Promise<void> => {
	let pictureURL = '';

	try {
		// update picture
		if (values.displayPicture) {
			pictureURL = await updateProfilePicture(values.displayPicture as File);
		}

		const data = {
			bio: values.bio,
			name: values.name,
			// add displayPicture if pictureURL is truthy
			...(pictureURL && { displayPicture: pictureURL }),
		};

		// update name
		await account.updateName(data.name);

		// update other information
		await db.updateDocument(
			APPWRITE_CONST.KRELLO_DB_ID,
			APPWRITE_CONST.USER_COLLECTION_ID,
			values.id,
			data,
		);

		// AFTER ALL THE UPDATES ARE COMPLETED
		// make updates to the store;
		authStore.update((prevState: AuthState): AuthState => {
			const userDetails = prevState.userDetails as UserDetails;
			return {
				...prevState,
				userDetails: {
					...userDetails,
					...data,
				},
			};
		});
		await goto(ROUTES.MY_PROFILE);
		toast.success('Profile updated successfully');
	} catch (e: any) {
		toast.error(e.message);
		console.log(e);
	}
};

const updateProfilePicture = async (file: File): Promise<string> => {
	const fileId = uuidv4();
	await storage.createFile(APPWRITE_CONST.PROFILE_PIC_BUCKET_ID, fileId, file);

	const result = storage.getFilePreview(
		APPWRITE_CONST.PROFILE_PIC_BUCKET_ID,
		fileId,
		200, // width
		200, // height
	);

	return result.href;
};
