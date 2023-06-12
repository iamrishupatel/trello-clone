import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { teams } from '$lib/api/appwrite/client';
import type { AppwriteApiError } from '$lib/types/error.types';
import ERROR_TYPES from '$lib/constants/error.constants';

type PageData = {
	userId: string;
	secret: string;
	membershipId: string;
	teamId: string;
	hasJoinedTeam: boolean;
};

export const load = (async ({ url }): Promise<PageData> => {
	const membershipId = url.searchParams.get('membershipId');
	const userId = url.searchParams.get('userId');
	const secret = url.searchParams.get('secret');
	const teamId = url.searchParams.get('teamId');

	if (!membershipId || !userId || !teamId || !secret) {
		throw error(404);
	}

	let hasJoinedTeam: boolean;

	try {
		const res = await teams.updateMembershipStatus(teamId, membershipId, userId, secret);
		hasJoinedTeam = res.confirm;
	} catch (e) {
		const err = e as AppwriteApiError;

		if (err.type === ERROR_TYPES.MEMBERSHIP_ALREADY_CONFIRMED) {
			hasJoinedTeam = true;
		} else {
			hasJoinedTeam = false;
			throw error(err.code, err.message);
		}
	}

	return {
		userId,
		secret,
		membershipId,
		teamId,
		hasJoinedTeam,
	};
}) satisfies PageLoad;
