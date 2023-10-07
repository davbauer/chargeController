import InterfaceLiveData from '../models/InterfaceLiveData.js';

export default class {
	static defaultData: InterfaceLiveData = {
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
			PhaseMode: 0
		},
		Battery: {
			Status: 'OFFLINE',
			Percent: -1,
			Power: -1
		}
	};
	static data: InterfaceLiveData = this.defaultData;
}
