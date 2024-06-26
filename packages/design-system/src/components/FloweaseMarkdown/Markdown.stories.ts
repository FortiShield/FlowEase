import type { StoryFn } from '@storybook/vue3';
import FloweaseMarkdown from './Markdown.vue';

export default {
	title: 'Atoms/Markdown',
	component: FloweaseMarkdown,
	argTypes: {
		content: {
			control: {
				type: 'text',
			},
		},
		loading: {
			control: {
				type: 'boolean',
			},
		},
		loadingBlocks: {
			control: {
				type: 'select',
			},
			options: [1, 2, 3, 4, 5],
		},
		loadingRows: {
			control: {
				type: 'select',
			},
			options: [1, 2, 3, 4, 5],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		FloweaseMarkdown,
	},
	template: '<flowease-markdown v-bind="args"></flowease-markdown>',
});

export const Markdown = Template.bind({});
Markdown.args = {
	content:
		'I wanted a system to monitor website content changes and notify me. So I made it using flowease.\n\nEspecially my competitor blogs. I wanted to know how often they are posting new articles. (I used their sitemap.xml file) (The below workflow may vary)\n\nIn the Below example, I used HackerNews for example.\n\nExplanation:\n\n- First HTTP Request node crawls the webpage and grabs the website source code\n- Then wait for x minutes\n- Again, HTTP Node crawls the webpage\n- If Node compares both results are equal if anything is changed. It’ll go to the false branch and notify me in telegram.\n\n**Workflow:**\n\n![](fileId:1)\n\n**Sample Response:**\n\n![](https://community.flowease.khulnasoft.com/uploads/default/original/2X/d/d21ba41d7ac9ff5cd8148fedb07d0f1ff53b2529.png)\n',
	loading: false,
	images: [
		{
			id: 1,
			url: 'https://community.flowease.khulnasoft.com/uploads/default/optimized/2X/b/b737a95de4dfe0825d50ca098171e9f33a459e74_2_690x288.png',
		},
	],
};
