import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InterfaceChaStatus from '../../models/InterfaceChaStatus.js';
export default class extends ApiBase {
	static async getChargeInfo(): Promise<InterfaceChaStatus | null> {
		return this.get<InterfaceChaStatus>(
			ConfigFile.read().ChargerHost,
			`api/status?filter=rssi,amp,ama,car,pha,wh,nrg,pnp,pwm,fsp,lccfi,psm`
		);
	}
	static async setChargeStart(): Promise<setChargeState | null> {
		return this.get<setChargeState>(ConfigFile.read().ChargerHost, `api/set?frc=0`);
	}
	static async setChargeStop(): Promise<setChargeState | null> {
		return this.get<setChargeState>(ConfigFile.read().ChargerHost, `api/set?frc=1`);
	}
	static async setChargeAmp(amp: number): Promise<setChargeAmp | null> {
		return this.get<setChargeAmp>(ConfigFile.read().ChargerHost, `api/set?amp=${amp}`);
	}
	static async setChargePhase(phase: number): Promise<setChargePhase | null> {
		return this.get<setChargePhase>(ConfigFile.read().ChargerHost, `api/set?psm=${phase}`);
	}
}

interface setChargeState {
	frc: boolean;
}

interface setChargeAmp {
	amp: boolean;
}

interface setChargePhase {
	psm: 0 | 1 | 2;
}
