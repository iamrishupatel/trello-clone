import * as Yup from 'yup';

const createLabelFormSchema = Yup.object().shape({
	text: Yup.string().required('Please enter the label text.'),
	color: Yup.string().required('Please choose a color.'),
});
export default createLabelFormSchema;
