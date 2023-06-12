import { ANON_USER_DATA } from '$lib/constants/app.constans';
import { authStore } from '$lib/store';
import type { AuthState, UserDetails } from '$lib/types/authStore';
import type { Board, BoardMember } from '$lib/types/board';
import type { User } from '$lib/types/user';
import type { Models } from 'appwrite';

export const enhanceBoardData = (
	board: any,
	bulkUsers: User[],
	teamMembers?: Models.Membership[],
): Board => {
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
		teamId: board.teamId,
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

	// populate the board members list
	if (teamMembers?.length) {
		boardData.members = teamMembers.map(({ userId, $id }: Models.Membership) => {
			const user = bulkUsers.find((userData) => userData.id === userId);

			return {
				...user,
				membershipId: $id,
			};
		}) as BoardMember[];
	}

	return boardData;
};
