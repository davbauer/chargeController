export default interface InterfaceConfig {
	Mapping: { amp: number; value: number; onePhase: boolean }[];
	Mode:
		| 'force_off' // -> Always make sure charger stays off
		| 'sleep' //-> Do not interact with charger at all
		| 'sun' // -> Only react if power available from sun
		| 'sun_force'; // -> Charge with minimum, increase when sun provides more power
	MainInverterHost: string;
	InverterHost1: string;
	ChargerHost: string;
	BatteryHost: string;
	CheckSeconds: number;
	MinimumWatts: number;
	MaximumWatts: number;
	OffsetWatts: number;
	BatteryCapacity: number;
	CarEfficiency: number;
	PreferredPhase:
		| 0 // -> Auto
		| 1 // -> Phase 2
		| 2; // -> Phase 3
}
