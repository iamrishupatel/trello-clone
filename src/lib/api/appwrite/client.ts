import { Client, Account } from 'appwrite';
import { PUBLIC_API_ENDPOINT, PUBLIC_APP_PROJECT_ID } from '$env/static/public';

export const client = new Client()
	.setEndpoint(PUBLIC_API_ENDPOINT as string) // Your API Endpoint
	.setProject(PUBLIC_APP_PROJECT_ID as string); // Your project ID

export const account = new Account(client);
