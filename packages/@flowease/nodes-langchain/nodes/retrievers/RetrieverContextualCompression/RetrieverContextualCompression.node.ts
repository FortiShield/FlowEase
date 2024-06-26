/* eslint-disable flowease-nodes-base/node-dirname-against-convention */
import {
	NodeConnectionType,
	type IExecuteFunctions,
	type INodeType,
	type INodeTypeDescription,
	type SupplyData,
} from 'flowease-workflow';

import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
import { LLMChainExtractor } from 'langchain/retrievers/document_compressors/chain_extract';
import type { BaseLanguageModel } from '@langchain/core/language_models/base';
import type { BaseRetriever } from '@langchain/core/retrievers';

import { logWrapper } from '../../../utils/logWrapper';

export class RetrieverContextualCompression implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Contextual Compression Retriever',
		name: 'retrieverContextualCompression',
		icon: 'fa:box-open',
		group: ['transform'],
		version: 1,
		description: 'Enhances document similarity search by contextual compression.',
		defaults: {
			name: 'Contextual Compression Retriever',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Retrievers'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.flowease.khulnasoft.com/integrations/builtin/cluster-nodes/sub-nodes/flowease-nodes-langchain.retrievercontextualcompression/',
					},
				],
			},
		},
		// eslint-disable-next-line flowease-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [
			{
				displayName: 'Model',
				maxConnections: 1,
				type: NodeConnectionType.AiLanguageModel,
				required: true,
			},
			{
				displayName: 'Retriever',
				maxConnections: 1,
				type: NodeConnectionType.AiRetriever,
				required: true,
			},
		],
		outputs: [
			{
				displayName: 'Retriever',
				maxConnections: 1,
				type: NodeConnectionType.AiRetriever,
			},
		],
		properties: [],
	};

	async supplyData(this: IExecuteFunctions, itemIndex: number): Promise<SupplyData> {
		this.logger.verbose('Supplying data for Contextual Compression Retriever');

		const model = (await this.getInputConnectionData(
			NodeConnectionType.AiLanguageModel,
			itemIndex,
		)) as BaseLanguageModel;

		const baseRetriever = (await this.getInputConnectionData(
			NodeConnectionType.AiRetriever,
			itemIndex,
		)) as BaseRetriever;

		const baseCompressor = LLMChainExtractor.fromLLM(model);

		const retriever = new ContextualCompressionRetriever({
			baseCompressor,
			baseRetriever,
		});

		return {
			response: logWrapper(retriever, this),
		};
	}
}
