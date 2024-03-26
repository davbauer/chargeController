import type ResBase from '../../models/ResBase';
import ApiBase from './ApiBase';

export default class extends ApiBase {
	static async postPreferredPhase(state: 0 | 1 | 2): Promise<ResBase> {
		return this.post<ResBase>('preferredPhase', { state });
	}
}
