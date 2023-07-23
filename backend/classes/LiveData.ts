import LiveDataInterface from '../models/LiveDataInterface.js';

export default class {
	static defaultData: LiveDataInterface = {
		StatusInverter: 'OFFLINE',
		StatusCharger: 'OFFLINE',
		Timestamp: null,
		Export: -1,
		ShouldStop: true,
		ChargerReserved: -1,
		LiveChargerAmp: -1,
		ChargerUse: -1,
		CalcChargerAmp: -1
	};
	static data: LiveDataInterface = this.defaultData;
}
