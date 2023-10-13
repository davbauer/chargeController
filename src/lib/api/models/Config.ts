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
}