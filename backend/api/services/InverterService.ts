import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InvPowerFlowRealtimeData from '../models/InvPowerFlowRealtimeData.js';
import InvMeterRealtimeData from '../models/InvMeterRealtimeData.js';
export default class extends ApiBase {
	static async getPowerFlowRealtimeData(host: string): Promise<InvPowerFlowRealtimeData> {
		return this.get<InvPowerFlowRealtimeData>(host, 'solar_api/v1/GetPowerFlowRealtimeData.fcgi');
	}
	static async getMeterRealtimeData(host: string): Promise<InvMeterRealtimeData> {
		return this.get<InvMeterRealtimeData>(
			host,
			'solar_api/v1/GetMeterRealtimeData.cgi?Scope=Device&DeviceId=0&DataCollection=CumulationInvert'
		);
	}
}
