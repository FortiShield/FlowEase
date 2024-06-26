import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
} from 'flowease-workflow';

import { listSearch, credentialTest, loadOptions } from './methods';

import { versionDescription } from './actions/versionDescription';

import { router } from './actions/router';

export class MySqlV2 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	methods = { listSearch, loadOptions, credentialTest };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await router.call(this);
	}
}
