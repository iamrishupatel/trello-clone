import ROUTES from '$constants/routes.constants';

export const getNavType = (currentPath: string): 'full' | 'minimal' => {
	const fullNavArr = [ROUTES.HOME];
	return fullNavArr.includes(currentPath) ? 'full' : 'minimal';
};
