import * as Yup from 'yup';

export const newBoardFormSchema = Yup.object().shape({
	file: Yup.mixed(),
	name: Yup.string()
		.required('Please enter a board name')
		.max(256, 'Board name cannot be longer than 256 characters'),
	isPrivate: Yup.boolean().required('Please specify privacy preference'),
	owner: Yup.string().required('Please enter the owner name'),
});

export const boardDescriptionFormSchema = Yup.object().shape({
	id: Yup.string().required(),
	description: Yup.string()
		.required('Please enter a description')
		.max(5000, 'Description  cannot be longer than 5000 characters'),
	textContent: Yup.string()
		.required('Please enter a description')
		.max(5000, 'Description  cannot be longer than 5000 characters'),
});
