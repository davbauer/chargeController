import type ResBase from '../models/ResBase';
import ApiBase from './ApiBase';

export default class extends ApiBase {
	static async postEnabled(state: boolean): Promise<ResBase> {
		return this.post<ResBase>('enabled', { state });
	}
}
