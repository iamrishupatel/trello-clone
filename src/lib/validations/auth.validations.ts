import * as Yup from 'yup';

export const resetPasswordSchema = Yup.object().shape({
	password: Yup.string()
		.min(8, 'Password must be at least 8 characters')
		.required('Password is required'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match')
		.required('Confirm Password is required'),
});

export const createAccountValidation = Yup.object().shape({
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

export const editProfileValidation = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	bio: Yup.string().max(256, 'Bio must be at max 256 characters'),
	email: Yup.string().required('Email is required'),
	phone: Yup.string(),
});

export const loginFormValidation = Yup.object().shape({
	// password must be at least character
	// needs to be same as appwrite requirements
	password: Yup.string()
		.required('Password is required')
		.min(8, 'Password must be at least 8 characters'),
	email: Yup.string().email('Please enter a valid email address').required('Email is required'),
});
