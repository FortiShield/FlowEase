import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';
import FloweaseColorPicker from './ColorPicker.vue';

export default {
	title: 'Atoms/ColorPicker',
	component: FloweaseColorPicker,
	argTypes: {
		disabled: {
			control: 'boolean',
		},
		size: {
			control: 'select',
			options: ['mini', 'small', 'medium', 'large'],
		},
		showAlpha: {
			control: 'boolean',
		},
		colorFormat: {
			control: 'select',
			options: ['hsl', 'hsv', 'hex', 'rgb'],
		},
		popperClass: {
			control: 'text',
		},
		predefine: {
			control: 'array',
		},
	},
};

const methods = {
	onChange: action('change'),
	onActiveChange: action('active-change'),
	onInput: action('update:modelValue'),
};

const DefaultTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		FloweaseColorPicker,
	},
	data: () => ({
		color: null,
	}),
	template:
		'<flowease-color-picker v-model="color" v-bind="args" @update:modelValue="onInput" @change="onChange" @active-change="onActiveChange" />',
	methods,
});

export const Default = DefaultTemplate.bind({});
Default.args = {
	disabled: false,
	size: 'medium',
	showAlpha: false,
	colorFormat: '',
	popperClass: '',
	showInput: true,
};
