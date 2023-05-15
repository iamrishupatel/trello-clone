import * as Yup from 'yup';

const loginFormValidation = Yup.object().shape({
	// password must be at least character
	// needs to be same as appwrite requirements
	password: Yup.string()
		.required('Password is required')
		.min(8, 'Password must be at least 8 characters'),
	email: Yup.string().email('Please enter a valid email address').required('Email is required'),
});

export default loginFormValidation;
