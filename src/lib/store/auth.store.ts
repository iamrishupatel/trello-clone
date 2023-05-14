import { writable } from 'svelte/store';

type AuthState = {
	isAuthenticated: boolean;
	userDetails: {
		fullname: string;
		bio: string;
		phone: string;
		email: string;
		displayPicture: string;
	};
};

const initialValues: AuthState = {
	isAuthenticated: true,
	userDetails: {
		fullname: 'Luna',
		bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi doloremque fugiat enim quis itaque iste nulla nisi harum a id iusto consectetur minima dolores illo, rerum cumque. Maxime, excepturi nihil.',
		phone: '9876543210',
		email: 'luna@example.com',
		displayPicture:
			'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
	},
};

const authStore = writable(initialValues);

export default authStore;
