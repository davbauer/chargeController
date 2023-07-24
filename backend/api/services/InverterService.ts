import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InvPowerFlowRealtimeData from '../models/InvPowerFlowRealtimeData.js'
export default class extends ApiBase {
	static async getPowerFlowRealtimeData(): Promise<InvPowerFlowRealtimeData> {
		return this.get<InvPowerFlowRealtimeData>(
			ConfigFile.read().InverterHost,
			'solar_api/v1/GetPowerFlowRealtimeData.fcgi'
		);
	}
}
