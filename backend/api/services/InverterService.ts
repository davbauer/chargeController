import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InvPowerFlowRealtimeData from '../models/InvPowerFlowRealtimeData.js'
import InvMeterRealtimeData from '../models/InvMeterRealtimeData.js'
export default class extends ApiBase {
	static async getPowerFlowRealtimeData(): Promise<InvPowerFlowRealtimeData> {
		return this.get<InvPowerFlowRealtimeData>(
			ConfigFile.read().InverterHost,
			'solar_api/v1/GetPowerFlowRealtimeData.fcgi'
		);

	}
	static async getMeterRealtimeData(): Promise<InvMeterRealtimeData> {
		return this.get<InvMeterRealtimeData>(
			ConfigFile.read().InverterHost,
			'solar_api/v1/GetMeterRealtimeData.cgi?Scope=Device&DeviceId=0&DataCollection=CumulationInvert'
		);
	}
}
