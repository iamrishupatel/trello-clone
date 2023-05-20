export const getNavType = (currentPath: string): 'full' | 'minimal' => {
	const fullNavArr: string[] = [];
	return fullNavArr.includes(currentPath) ? 'full' : 'minimal';
};
