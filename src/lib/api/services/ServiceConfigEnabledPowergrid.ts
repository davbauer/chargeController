import type ResBase from '../models/ResBase';
import ApiBase from './ApiBase';

export default class extends ApiBase {
	static async postEnabledPowergrid(state: boolean): Promise<ResBase> {
		return this.post<ResBase>('enabledPowergrid', { state });
	}
}
