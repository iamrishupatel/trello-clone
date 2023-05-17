import type { Board, BoardMember, NewBoardFormData } from '$types/board';
import { faker } from '@faker-js/faker';

export const createNewBoard = async (data: NewBoardFormData): Promise<void> => {
	console.log('incoming data', data);

	// TODO: INTEGRATION
};

export const getAllBoards = async (): Promise<Board[]> => {
	const boards: Board[] = [];

	for (let i = 0; i < 5; i++) {
		const members: BoardMember[] = [];

		for (let j = 0; j < 5; j++) {
			members.push({
				displayPicture: faker.image.avatar(),
				name: faker.person.fullName(),
				id: faker.string.uuid(),
			});
		}

		const board: Board = {
			id: faker.string.uuid(),
			name: faker.lorem.sentence(),
			members,
			coverURL: faker.image.url(),
			owner: faker.string.uuid(),
		};

		boards.push(board);
	}

	return boards;
};
