import ApiBase from './ApiBase.js';
import ConfigFile from '../../classes/ConfigFile.js';
import InterfaceChaStatus from '../../models/InterfaceChaStatus.js';
export default class extends ApiBase {
	static async getChargeInfo(): Promise<InterfaceChaStatus> {
		return this.get<InterfaceChaStatus>(
			ConfigFile.read().ChargerHost,
			`api/status?filter=rssi,amp,ama,car,pha,wh,nrg,pnp,pwm,fsp,lccfi,psm`
		);
	}
	static async setChargeStart(): Promise<setChargeState> {
		return this.get<setChargeState>(ConfigFile.read().ChargerHost, `api/set?frc=0`);
	}
	static async setChargeStop(): Promise<setChargeState> {
		return this.get<setChargeState>(ConfigFile.read().ChargerHost, `api/set?frc=1`);
	}
	static async setChargeAmp(amp: number): Promise<setChargeAmp> {
		return this.get<setChargeAmp>(ConfigFile.read().ChargerHost, `api/set?amp=${amp}`);
	}
	static async setChargePhase(phase: number): Promise<setChargePhase> {
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
	psm:
	0 // Automatic
	| 1 // Force 1 Phase
	| 2; // Force 3 Phases
}