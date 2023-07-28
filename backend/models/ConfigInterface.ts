export default interface ConfigInterface {
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
}
