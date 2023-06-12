import { Client, Account, Databases, Storage, Teams } from 'appwrite';
import { PUBLIC_API_ENDPOINT, PUBLIC_APP_PROJECT_ID } from '$env/static/public';

export const appwriteClient = new Client()
	.setEndpoint(PUBLIC_API_ENDPOINT as string) // Your API Endpoint
	.setProject(PUBLIC_APP_PROJECT_ID as string); // Your project ID

export const account = new Account(appwriteClient);
export const db = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);
export const teams = new Teams(appwriteClient);
