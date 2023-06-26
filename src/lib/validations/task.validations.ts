import * as Yup from 'yup';

export const createTaskFormSchema = Yup.object().shape({
	title: Yup.string()
		.required('Title is required')
		.max(200, 'Description cannot be more than 200 characters'),

	description: Yup.string().max(9000, 'Description cannot be more than 9000 characters'),
	statusId: Yup.string().required('Status is required'),
	labels: Yup.array(),
	priorityId: Yup.string(),
});

export const createLabelFormSchema = Yup.object().shape({
	text: Yup.string().required('Please enter the label text.'),
	color: Yup.string().required('Please choose a color.'),
});

export const createCommentValidationSchema = Yup.object().shape({
	authorId: Yup.string().required(),
	body: Yup.string()
		.required('Please enter a comment')
		.max(9000, 'Comment cannot be longer than 9000 characters'),
	_bodyText: Yup.string()
		.required('Please enter a comment')
		.max(9000, 'Comment cannot be longer than 9000 characters'),
});

export const updateCommentValidationSchema = Yup.object().shape({
	body: Yup.string()
		.required('Please enter a comment')
		.max(9000, 'Comment cannot be longer than 9000 characters'),
});
