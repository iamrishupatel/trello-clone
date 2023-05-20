import * as Yup from 'yup';

const boardDescriptionFormSchema = Yup.object().shape({
	id: Yup.string().required(),
	description: Yup.string()
		.required('Please enter a description')
		.max(5000, 'Description  cannot be longer than 5000 characters'),
});
export default boardDescriptionFormSchema;
