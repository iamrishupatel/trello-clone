import { v4 as uuidv4 } from 'uuid';
import type { TaskPriority } from '$lib/types/kanban';
import { PUBLIC_APP_URL } from '$env/static/public';

export const DEFAULT_BOARDS_PAGINATION_LIMIT = 100;
export const APP_URL = PUBLIC_APP_URL ?? 'http://localhost:3000';
export const APP_CONFIG_CONTEXT_KEY = 'app-config-context-key';

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
