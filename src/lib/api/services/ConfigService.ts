import type Config from '../models/Config';
import type ResBase from '../models/ResBase';
import ApiBase from './ApiBase';

export default class extends ApiBase {
	static async getConfig(baseURL: string): Promise<Config> {
		return this.get<Config>(baseURL, 'config');
	}
	static async postConfig(baseUrl: string, body: Config): Promise<ResBase> {
		return this.post<ResBase>(baseUrl, 'config', body);
	}
}
