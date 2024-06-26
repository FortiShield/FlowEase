/* eslint-disable flowease-nodes-base/node-filename-against-convention */
import type { INodeTypeDescription } from 'flowease-workflow';

import * as itemList from './itemList';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Item Lists',
	name: 'itemLists',
	icon: 'file:itemLists.svg',
	group: ['input'],
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'Helper for working with lists of items and transforming arrays',
	version: [3, 3.1],
	defaults: {
		name: 'Item Lists',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [],
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'hidden',
			options: [
				{
					name: 'Item List',
					value: 'itemList',
				},
			],
			default: 'itemList',
		},
		...itemList.description,
	],
};
