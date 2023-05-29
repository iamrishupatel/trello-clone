import * as Yup from 'yup';

const createTaskFormSchema = Yup.object().shape({
	title: Yup.string()
		.required('Title is required')
		.max(200, 'Description cannot be more than 200 characters'),

	description: Yup.string().max(9000, 'Description cannot be more than 9000 characters'),
	statusId: Yup.string().required('Status is required'),
});

export default createTaskFormSchema;
