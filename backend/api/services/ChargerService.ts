import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InterfaceChaStatus from '../../models/InterfaceChaStatus.js';
export default class extends ApiBase {
	static async getChargeInfo(): Promise<InterfaceChaStatus> {
		return this.get<InterfaceChaStatus>(
			ConfigFile.read().ChargerHost,
			`api/status?filter=rssi,amp,ama,car,pha,wh,nrg,pnp,pwm,fsp,lccfi`
		);
	}
	static async setChargeStart(): Promise<setChargeState> {
		return this.get<setChargeState>(ConfigFile.read().ChargerHost, `api/set?frc=0`);
	}
	static async setChargeStop(): Promise<setChargeState> {
		return this.get<setChargeState>(ConfigFile.read().ChargerHost, `api/set?frc=1`);
	}
	static async setChargeAmp(amp: number): Promise<setChargAmp> {
		return this.get<setChargAmp>(ConfigFile.read().ChargerHost, `api/set?amp=${amp}`);
	}
}

interface setChargeState {
	frc: boolean;
}

interface setChargAmp {
	amp: boolean;
}
