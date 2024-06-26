import FloweaseUsersList from './UsersList.vue';
import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';
import type { IUser } from '@/types';

export default {
	title: 'Modules/UsersList',
	component: FloweaseUsersList,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onReinvite: action('reinvite'),
	onDelete: action('delete'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		FloweaseUsersList,
	},
	template:
		'<flowease-users-list v-bind="args" :actions="actions" @reinvite="onReinvite" @delete="onDelete" />',
	methods,
});

export const UsersList = Template.bind({});
UsersList.args = {
	actions: [
		{
			label: 'Resend Invite',
			value: 'reinvite',
			guard: (user: IUser) => !user.firstName,
		},
		{
			label: 'Delete User',
			value: 'delete',
		},
	],
	users: [
		{
			id: '1',
			firstName: 'Sunny',
			lastName: 'Side',
			fullName: 'Sunny Side',
			email: 'sunny@flowease.khulnasoft.com',
			isDefaultUser: false,
			isPendingUser: false,
			isOwner: true,
			signInType: 'email',
			disabled: false,
		},
		{
			id: '2',
			firstName: 'Kobi',
			lastName: 'Dog',
			fullName: 'Kobi Dog',
			email: 'kobi@flowease.khulnasoft.com',
			isDefaultUser: false,
			isPendingUser: false,
			isOwner: false,
			signInType: 'ldap',
			disabled: true,
		},
		{
			id: '3',
			email: 'invited@flowease.khulnasoft.com',
			isDefaultUser: false,
			isPendingUser: true,
			isOwner: false,
		},
	],
	currentUserId: '1',
};
