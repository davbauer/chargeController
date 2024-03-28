import type LiveData from '$lib/models/LiveData';
import ApiBase from './ApiBase';

export default class extends ApiBase {
	static async getLiveData(): Promise<LiveData> {
		return this.get<LiveData>('livedata');
	}
}
