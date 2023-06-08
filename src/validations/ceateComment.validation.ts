import * as Yup from 'yup';

const createCommentValidationSchema = Yup.object().shape({
	authorId: Yup.string().required(),
	body: Yup.string()
		.required('Please enter a comment')
		.max(9000, 'Comment cannot be longer than 9000 characters'),
});

export default createCommentValidationSchema;
