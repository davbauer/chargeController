import type ResBase from '../../models/ResBase';
import type Config from '../../models/Config';
import ApiBase from './ApiBase';

export default class extends ApiBase {
	static async postMode(state: Config['Mode']): Promise<ResBase> {
		return this.post<ResBase>('mode', { state });
	}
}
