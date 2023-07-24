export default interface Config {
	Mapping: { amp: number; value: number }[];
	Enabled: boolean;
	InverterHost: string;
	ChargerHost: string;
	BatteryHost: string;
	CheckSeconds: number;
	MinimumAmps: number;
	MaximumAmps: number;
	UsePowergrid: boolean;
	BatteryCapacity: number;
}
