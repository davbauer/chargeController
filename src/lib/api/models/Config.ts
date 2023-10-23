export default interface Config {
	Mapping: { amp: number; value: number; onePhase: boolean }[];
	Enabled: boolean;
	MainInverterHost: string;
	InverterHost1: string;
	ChargerHost: string;
	BatteryHost: string;
	CheckSeconds: number;
	MinimumWatts: number;
	MaximumWatts: number;
	UsePowergrid: boolean;
	BatteryCapacity: number;
	CarEfficiency: number;
	// 0 = Auto, 1 = One Phase, 2 = 3 Phases 
	PreferredPhase: 0 | 1 | 2
}
