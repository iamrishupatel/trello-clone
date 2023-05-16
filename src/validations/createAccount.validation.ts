import * as Yup from 'yup';

const createAccountValidation = Yup.object().shape({
	name: Yup.string()
		.required('Name is required')
		.max(128, 'Name cannot be more than 128 characters')
		.min(3, 'Name should be at least 3 characters'),

	// password must be at least character
	// needs to be same as appwrite requirements
	password: Yup.string()
		.required('Password is required')
		.min(8, 'Password must be at least 8 characters'),

	email: Yup.string().email('Please enter a valid email address').required('Email is required'),
});

export default createAccountValidation;
