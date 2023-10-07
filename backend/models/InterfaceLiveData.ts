export default interface InterfaceLiveData {
	Timestamp: Date | null;
	Inverter: {
		Export: number;
		SunPower: number;
	};
	MainInverter: {
		Status: 1 | 'OFFLINE';
	};
	Inverter1: {
		Status: 1 | 'OFFLINE';
	};
	Charger: {
		// (Unknown/Error=0, Idle=1, Charging=2, WaitCar=3, Complete=4, Error=5)
		Status: 0 | 1 | 2 | 3 | 4 | 5 | 'OFFLINE';
		ShouldStop: boolean;
		AmpCalc: number;
		Amp: number;
		Consumption: number;
		Reserved: number;
		LinkTime: number;
		ChargedSinceLink: number;
		PhaseMode: 0 | 1 | 2;
	};
	Battery: {
		// (Busy=0, Ready=1, Charging=2, Discharging=3, Standby=4, Error=5, Service/Update=6, Emergency Power=7)
		Status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'OFFLINE';
		Percent: number;
		Power: number;
	};
}
