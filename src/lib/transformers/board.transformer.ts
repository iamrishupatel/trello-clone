import { ANON_USER_DATA } from '$constants/app.constans';
import { authStore } from '$lib/store';
import type { AuthState, UserDetails } from '$types/authStore';
import type { Board } from '$types/board';
import type { User } from '$types/user';

export const enhanceBoardData = (board: any, bulkUsers: User[]): Board => {
	let currentUser: UserDetails | undefined;

	authStore.subscribe((authStore: AuthState) => {
		if (authStore.userDetails) {
			currentUser = authStore.userDetails;
		}
	});

	// board to be returned
	const boardData: Board = {
		id: board.$id,
		coverURL: board.coverURL,
		name: board.name,
		owner: bulkUsers.find((user) => user.id === board.owner) ?? ANON_USER_DATA,
		members: [],
		isPrivate: board.isPrivate,
		labels: [],
		description: board.description ?? '',
		createdAt: board.$createdAt,
	};

	// ADD SOME LABELS TO THE BOARD
	boardData.labels?.push({
		color: board.isPrivate ? 'red' : 'green',
		id: '1',
		text: board.isPrivate ? 'Private Board' : 'Public Board',
	});

	if (currentUser && board.owner === currentUser.id) {
		boardData.labels?.push({
			color: 'indigo',
			id: 'my-board',
			text: 'My Board',
		});
	}

	// map the users wuth their data
	boardData.members = board.members.map((member: string) => {
		const user = bulkUsers.find((userData) => userData.id === member);

		if (user) {
			return user;
		}

		return member;
	});

	return boardData;
};
