import { Client, Account, Databases, Storage } from 'appwrite';
import { PUBLIC_API_ENDPOINT, PUBLIC_APP_PROJECT_ID } from '$env/static/public';
import APPWRITE_CONST from '$lib/constants/appwrite.constants';

export const appwriteClient = new Client()
	.setEndpoint(PUBLIC_API_ENDPOINT as string) // Your API Endpoint
	.setProject(PUBLIC_APP_PROJECT_ID as string); // Your project ID

export const account = new Account(appwriteClient);
export const db = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);

// DELETE ALL DOCS IN A GIVEN COLLECTION
// FOR DEVELOPMENT PURPOSE ONLY
// USE CAREFULLY
export const deleteAlldocs = async (collectionId: string): Promise<void> => {
	try {
		const docs = await db.listDocuments(APPWRITE_CONST.KRELLO_DB_ID, collectionId);

		for (const doc of docs.documents) {
			const id = doc.$id;
			await db.deleteDocument(APPWRITE_CONST.KRELLO_DB_ID, collectionId, id);
		}
	} catch (e: any) {
		console.error(e.message || 'Some error occurred while deleting documents.');
	}
};
