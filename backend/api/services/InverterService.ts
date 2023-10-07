import ApiBase from './ApiBase.js';
import InterfaceInvPowerFlowRealtimeData from '../../models/InterfaceInvPowerFlowRealtimeData.js';
import InterfaceInvMeterRealtimeData from '../../models/InterfaceInvMeterRealtimeData.js';
export default class extends ApiBase {
	static async getPowerFlowRealtimeData(host: string): Promise<InterfaceInvPowerFlowRealtimeData> {
		return this.get<InterfaceInvPowerFlowRealtimeData>(
			host,
			'solar_api/v1/GetPowerFlowRealtimeData.fcgi'
		);
	}
	static async getMeterRealtimeData(host: string): Promise<InterfaceInvMeterRealtimeData> {
		return this.get<InterfaceInvMeterRealtimeData>(
			host,
			'solar_api/v1/GetMeterRealtimeData.cgi?Scope=Device&DeviceId=0&DataCollection=CumulationInvert'
		);
	}
}
