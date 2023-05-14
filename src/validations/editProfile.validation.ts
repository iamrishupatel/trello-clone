import * as Yup from 'yup';

const editProfileValidation = Yup.object().shape({
	fullname: Yup.string().required('Name is required'),
	bio: Yup.string()
		.max(256, 'Bio must be at max 256 characters')
		.min(10, 'Bio must be at least 10 characters'),
	email: Yup.string().required('Email is required'),
	phone: Yup.string(),
	displayPicture: Yup.string(),
});

export default editProfileValidation;
