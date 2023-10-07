import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type AppInfo from './api/models/AppInfo';
import type Config from './api/models/Config';
import type LiveData from './api/models/LiveData';




export const toasts: Writable<Toast[]> = writable([]);


export const appInfo: Writable<AppInfo> = writable({
    webSocketPort: -1,
    gitCommitId: "undefined",
    gitBranchName: "undefined",
    upime: -1,
    environment: "developement",
    nodeVersion: "undefined",
});
export const config: Writable<Config> = writable({
    Mapping: [],
    Enabled: false,
    MainInverterHost: "undefined",
    InverterHost1: "undefined",
    ChargerHost: "undefined",
    BatteryHost: "undefined",
    CheckSeconds: -1,
    MinimumAmps: -1,
    MaximumAmps: -1,
    UsePowergrid: false,
    BatteryCapacity: -1,
    CarEfficiency: -1,
})
export const liveData: Writable<LiveData> = writable({
    Timestamp: null,
    Inverter: {
        Export: -1,
        SunPower: -1
    },
    MainInverter: {
        Status: 'OFFLINE'
    },
    Inverter1: {
        Status: 'OFFLINE'
    },
    Charger: {
        // (Unknown/Error=0, Idle=1, Charging=2, WaitCar=3, Complete=4, Error=5)
        Status: 'OFFLINE',
        ShouldStop: true,
        AmpCalc: -1,
        Amp: -1,
        Consumption: -1,
        Reserved: -1,
        LinkTime: -1,
        ChargedSinceLink: -1
    },
    Battery: {
        Status: 'OFFLINE',
        Percent: -1,
        Power: -1
    }
})