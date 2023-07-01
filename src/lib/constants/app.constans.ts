import { v4 as uuidv4 } from 'uuid';
import type { TaskPriority } from '$lib/types/kanban';
import { PUBLIC_APP_URL } from '$env/static/public';

export const DEFAULT_BOARDS_PAGINATION_LIMIT = 100;
export const APP_URL = PUBLIC_APP_URL ?? 'http://localhost:3000';
export const APP_CONFIG_CONTEXT_KEY = 'app-config-context-key';
export const TASK_CONTEXT_KEY = 'task-context-key';

export const ANON_USER_DATA = {
	isAnonymous: true,
	displayPicture: '',
	email: 'anonymous@rlabs.dev',
	id: uuidv4(),
	name: 'Anonymous',
};

export const AVAILABLE_LABEL_COLORS = [
	{
		value: 'blue',
		tailwindCls:
			'bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300',
	},
	{
		value: 'dark',
		tailwindCls:
			'bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300',
	},
	{
		value: 'red',
		tailwindCls:
			'bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300',
	},
	{
		value: 'green',
		tailwindCls:
			'bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300',
	},
	{
		value: 'yellow',
		tailwindCls:
			'bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300',
	},
	{
		value: 'indigo',
		tailwindCls:
			'bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300',
	},
	{
		value: 'purple',
		tailwindCls:
			'bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300',
	},
	{
		value: 'pink',
		tailwindCls:
			'bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300',
	},
];

export const TASK_PRIORITIES: TaskPriority[] = [
	{
		id: 'U_TP_3XJ7K9',
		text: 'urgent',
		color: 'pink',
	},
	{
		id: 'H_TP_A2C5G8',
		text: 'high',
		color: 'red',
	},
	{
		id: 'M_TP_E1B4F6',
		text: 'medium',
		color: 'yellow',
	},
	{
		id: 'L_TP_Z9Y2R7',
		text: 'low',
		color: 'green',
	},
];

export const faqs = [
	{
		question: 'How do I create and manage tasks in the Trello clone web app?',
		answer:
			'To create a task, simply navigate to the desired board and click on the \'Add New Task\' button. Provide a title, description, and any other relevant details. To manage tasks, you can drag and drop them between different lists or mannualy update their status.',
	},
	{
		question: 'Can I create both public and private boards?',
		answer:
			'Yes, our Krello web app allows all users to create public boards, whereas private boards can only be created by authenticated user (not anonymous). Public boards are visible to all users, enabling seamless collaboration, while private boards offer enhanced privacy and control, accessible only to selected members.',
	},
	{
		question: 'Is anonymous login available in the Trello clone web app?',
		answer:
			'Yes, we provide an anonymous login feature. You can choose to log in anonymously to access basic functionalities and explore the app\'s features. However, creating an account will unlock additional features like creating Private board and enable better collaboration.',
	},
	{
		question: 'How do I invite team members to my board?',
		answer:
			'Once your board is private then  click on the plus icon near the board privacy section to see the users then click on the add button to send a invitation email user to that user. Once the user accepts the invitation they can access and collaborate in your private board.',
	},
];

export const features = [
	{
		title: 'Drag and Drop Tasks',
		icon: 'material-symbols:drag-click-rounded',
		description: `
     Tasks can be easily rearranged and organized by dragging and dropping them within the board, providing a convenient way to update task status.    
`,
	},

	{
		title: 'Public and Private Boards',
		icon: 'ri:git-repository-private-fill',
		description: `
Public boards are accessible by all user whereas private boards are accessible to team members only.
 `,
	},

	{
		title: 'Anonymous Login',
		icon: 'ooui:user-anonymous',
		description:
			'Experience hassle-free access to the app with the option for anonymous login. Dive right into managing tasks and collaborating on projects without the need for an account.',
	},
	{
		title: 'Enhanced Editing with Quill',
		icon: 'ri:quill-pen-fill',
		description:
			'Leverage the power of Quill, a rich text editor, to create visually appealing and well-formatted task descriptions. Customize text, add formatting, and make communication more effective.',
	},
	{
		title: 'Real-time Comments and Collaboration',
		icon: 'material-symbols:comment',
		description:
			'Facilitate real-time collaboration and feedback with the ability to leave comments on tasks.',
	},
	{
		title: 'Assign Labels, Priority, & Descriptions.',
		icon: 'material-symbols:description',
		description: `
    Assign labels to tasks to categorize them based on different criteria.
    Priorities can be set to indicate the importance or urgency of tasks.
    Descriptions can be added to provide detailed instructions or information.

    `,
	},
];
