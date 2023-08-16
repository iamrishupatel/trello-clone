import { browser } from '$app/environment';
import { redirectToHomeIfLoggedIn } from '$lib/utils/auth.utils';
import type { PageLoad } from './$types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const load = (() => {
	if (browser) {
		redirectToHomeIfLoggedIn();
	}
}) satisfies PageLoad;
