import APPWRITE_CONST from '$constants/appwrite.constants';
import type { CreateNewLabelFormValues } from '$types/formValues';
import { v4 as uuidv4 } from 'uuid';

import { db } from './client';
import toast from 'svelte-french-toast';
import boardStore from '$lib/store/boards.store';

const { KRELLO_DB_ID, LABELS_COLLECTION_ID } = APPWRITE_CONST;

export const createNewLabel = async (values: CreateNewLabelFormValues): Promise<void> => {
	try {
		const docId = uuidv4();
		const payload = {
			...values,
		};
		const labelDoc = await db.createDocument(KRELLO_DB_ID, LABELS_COLLECTION_ID, docId, payload);

		// add the newly created label to store.
		boardStore.update((store) => {
			store.labels.push({
				id: labelDoc.$id,
				text: labelDoc.text,
				color: labelDoc.color,
			});
			return store;
		}),
			toast.success('Label created successfully');
	} catch (e: any) {
		console.log(e);
		toast.error(e.message);
	}
};
