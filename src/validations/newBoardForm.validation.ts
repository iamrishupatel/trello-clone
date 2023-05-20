import * as Yup from 'yup';

const newBoardFormSchema = Yup.object().shape({
	file: Yup.mixed(),
	name: Yup.string()
		.required('Please enter a board name')
		.max(256, 'Board name cannot be longer than 256 characters'),
	isPrivate: Yup.boolean().required('Please specify privacy preference'),
	owner: Yup.string().required('Please enter the owner name'),
});
export default newBoardFormSchema;
