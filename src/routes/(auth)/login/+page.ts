import type { PageLoad } from './$types';
import ROUTES from '$lib/constants/routes.constants';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const load = (({ url }) => {
	const source = url.searchParams.get('source');

	return {
		isComingFromResetPassword: source === ROUTES.RESET_PASSWORD ? true : false,
	};
}) satisfies PageLoad;
