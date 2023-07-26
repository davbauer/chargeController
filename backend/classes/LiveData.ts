import LiveDataInterface from '../models/LiveDataInterface.js';

export default class {
	static defaultData: LiveDataInterface = {
		Timestamp: null,
		Inverter: {
			Export: -1,
			SunPower: -1
		},
		MainInverter: {
			Status: 'OFFLINE',
		},
		Inverter1: {
			Status: 'OFFLINE',
		},
		Charger: {
			// (Unknown/Error=0, Idle=1, Charging=2, WaitCar=3, Complete=4, Error=5)
			Status: 'OFFLINE',
			ShouldStop: true,
			AmpCalc: -1,
			Amp: -1,
			Consumption: -1,
			Reserved: -1,
		},
		Battery: {
			Status: 'OFFLINE',
			Percent: -1,
			Power: -1,
		}
	};
	static data: LiveDataInterface = this.defaultData;
}
