import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type AppInfo from '$lib/models/AppInfo';
import type Config from '$lib/models/Config';
import type LiveData from '$lib/models/LiveData';
import type BackendLogs from '$lib/models/BackendLogs';
import type SignalState from '$lib/models/SignalState';

export const toasts: Writable<Toast[]> = writable([]);

export const activitySignal = writable<SignalState>({});

export const wsConnectionId: Writable<string> = writable('undefined');

export const appInfo: Writable<AppInfo> = writable({
	webSocketPort: -1,
	gitCommitId: 'undefined',
	gitBranchName: 'undefined',
	uptime: -1,
	environment: 'developement',
	nodeVersion: 'undefined'
});
export const config: Writable<Config> = writable({
	Mapping: [],
	Mode: 'sleep',
	MainInverterHost: 'undefined',
	InverterHost1: 'undefined',
	ChargerHost: 'undefined',
	BatteryHost: 'undefined',
	OffsetWatts: 0,
	CheckSeconds: -1,
	MinimumWatts: -1,
	MaximumWatts: -1,
	BatteryCapacity: -1,
	CarEfficiency: -1,
	PreferredPhase: 0
});
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
		ChargedSinceLink: -1,
		PhaseMode: 0,
		PhaseModeCalc: 0
	},
	Battery: {
		Status: 'OFFLINE',
		Percent: -1,
		Power: -1
	}
});

export const backendLogs: Writable<BackendLogs> = writable({ items: [] });
