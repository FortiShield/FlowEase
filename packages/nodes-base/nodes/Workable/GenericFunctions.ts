import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'flowease-workflow';
import { NodeApiError } from 'flowease-workflow';

export async function workableApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const credentials = (await this.getCredentials('workableApi')) as {
		accessToken: string;
		subdomain: string;
	};

	let options: IRequestOptions = {
		headers: { Authorization: `Bearer ${credentials.accessToken}` },
		method,
		qs,
		body,
		uri: uri || `https://${credentials.subdomain}.workable.com/spi/v3${resource}`,
		json: true,
	};
	options = Object.assign({}, options, option);
	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}
	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
