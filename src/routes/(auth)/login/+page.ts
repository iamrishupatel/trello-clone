import type { PageLoad } from './$types';
import ROUTES from '$lib/constants/routes.constants';
import { browser } from '$app/environment';
import { redirectToHomeIfLoggedIn } from '$lib/utils/auth.utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const load = (async ({ url }) => {
	const source = url.searchParams.get('source');

	if (browser) {
		redirectToHomeIfLoggedIn();
	}

	return {
		isComingFromResetPassword: source === ROUTES.RESET_PASSWORD ? true : false,
	};
}) satisfies PageLoad;
