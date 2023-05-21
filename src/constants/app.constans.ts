import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_BOARDS_PAGINATION_LIMIT = 100;
export const ANON_USER_DATA = {
	isAnonymous: true,
	displayPicture: '',
	email: 'anonymous@rlabs.dev',
	id: uuidv4(),
	name: 'Anonymous',
};
