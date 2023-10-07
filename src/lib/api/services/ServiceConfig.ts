import type Config from '../models/Config';
import type ResBase from '../models/ResBase';
import ApiBase from './ApiBase';

export default class extends ApiBase {
	static async getConfig(): Promise<Config> {
		return this.get<Config>('config');
	}
	static async postConfig(body: Config): Promise<ResBase> {
		return this.post<ResBase>('config', body);
	}
}
