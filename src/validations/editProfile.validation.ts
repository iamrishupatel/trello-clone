import * as Yup from 'yup';

const editProfileValidation = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	bio: Yup.string().max(256, 'Bio must be at max 256 characters'),
	email: Yup.string().required('Email is required'),
	phone: Yup.string(),
});

export default editProfileValidation;
