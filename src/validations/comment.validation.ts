import * as Yup from 'yup';

export const createCommentValidationSchema = Yup.object().shape({
	authorId: Yup.string().required(),
	body: Yup.string()
		.required('Please enter a comment')
		.max(9000, 'Comment cannot be longer than 9000 characters'),
});

export const updateCommentValidationSchema = Yup.object().shape({
	body: Yup.string()
		.required('Please enter a comment')
		.max(9000, 'Comment cannot be longer than 9000 characters'),
});
