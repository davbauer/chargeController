import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InvRealtimeData from '../models/InvRealTimeData.js';
export default class extends ApiBase {
	static async getRealtimeData(): Promise<InvRealtimeData> {
		return this.get<InvRealtimeData>(
			ConfigFile.read().InverterHost,
			'solar_api/v1/GetMeterRealtimeData.cgi?Scope=System'
		);
	}
}
