export default interface ChaStatus {
	rssi: number; // RSSI signal strength
	amp: number; // requestedCurrent in Ampere
	ama: number; // Max. charging in Ampere
	car: 0 | 1 | 2 | 3 | 4 | 5; // (Unknown/Error=0, Idle=1, Charging=2, WaitCar=3, Complete=4, Error=5)
	pha: [boolean, boolean, boolean, boolean, boolean, boolean];
	fsp: boolean; // force_single_phase (shows if currently single phase charge is enforced
	pwm: number; // phase wish mode for debugging / only for pv optimizing / used for timers later (Force_3=0, Wish_1=1, Wish_3=2)
	pnp: number; // Number of phases
	wh: number; // Energy in Wh since car connected
	nrg: [
		number, //[0]  U  L1
		number, //[1]  U  L2
		number, //[2]  U  L3
		number, //[3]  U  N
		number, //[4]  I  L1
		number, //[5]  I  L2
		number, //[6]  I  L3
		number, //[7]  I  N
		number, //[8]  P  L1
		number, //[9]  P  L2
		number, //[10] P  L3
		number, //[11] P  N
		number, //[12] pf L1
		number, //[13] pf L2
		number, //[14] pf L3
		number //[15] pf N
	];
}
