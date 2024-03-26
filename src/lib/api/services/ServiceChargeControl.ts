import type ResBase from '../../models/ResBase';
import ApiBase from './ApiBase';

export default class extends ApiBase {
	static async chargeStart(): Promise<ResBase> {
		return this.post<ResBase>('charge-start', undefined);
	}
	static async chargeStop(): Promise<ResBase> {
		return this.post<ResBase>('charge-stop', undefined);
	}
}
