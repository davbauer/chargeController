export default interface InterfaceConfig {
	Mapping: { amp: number; value: number }[];
	Enabled: boolean;
	MainInverterHost: string;
	InverterHost1: string;
	ChargerHost: string;
	BatteryHost: string;
	CheckSeconds: number;
	MinimumAmps: number;
	MaximumAmps: number;
	UsePowergrid: boolean;
	BatteryCapacity: number;
	CarEfficiency: number;
}
