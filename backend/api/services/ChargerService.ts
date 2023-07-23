import ApiBase from "./ApiBase.js";
import ConfigFile from '../../classes/ConfigFile.js'
import ChaStatus from "../models/ChaStatus.js";
export default class extends ApiBase {

    static async getChargeInfo(): Promise<ChaStatus> {
        return this.get<ChaStatus>(
            ConfigFile.read().ChargerHost,
            `api/status?filter=rssi,amp,ama,car,pha,wh,nrg,pnp,pwm,fsp`,
        );
    }
    static async setChargeStart(): Promise<setChargeState> {
        return this.get<setChargeState>(
            ConfigFile.read().ChargerHost,
            `api/set?frc=0`
        );
    }
    static async setChargeStop(): Promise<setChargeState> {
        return this.get<setChargeState>(
            ConfigFile.read().ChargerHost,
            `api/set?frc=1`,
        );
    }
    static async setChargeAmp(amp: number): Promise<setChargAmp> {
        return this.get<setChargAmp>(
            ConfigFile.read().ChargerHost,
            `api/set?amp=${amp}`,
        );
    }
}


interface setChargeState {
    frc: boolean
}

interface setChargAmp {
    amp: boolean
}