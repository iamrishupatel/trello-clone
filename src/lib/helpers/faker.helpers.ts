import type { Task } from '$types/kanban';
import { faker } from '@faker-js/faker';

export const generateFakeTasks = (n: number): Task[] => {
	const data = [];

	for (let i = 0; i < n; i++) {
		const task: Task = {
			id: faker.string.uuid(),
			title: faker.lorem.words(),
			coverUrl: faker.image.url(),
			description: '',
			labels: faker.helpers.arrayElements([
				{
					color: 'blue',
					id: faker.string.uuid(),
					text: 'Front-end',
				},
				{
					color: 'purple',
					id: faker.string.uuid(),
					text: 'concept',
				},
			]),
			priority: {
				color: 'red',
				id: faker.string.uuid(),
				text: 'high',
			},
			status: {
				id: '1',
				text: '📥 Backlog',
			},
			assignees: [
				{
					displayPicture: faker.image.avatar(),
					email: faker.internet.email(),
					name: faker.person.fullName(),
					id: faker.string.uuid(),
				},
			],
		};

		data.push(task);
	}

	return data;
};
