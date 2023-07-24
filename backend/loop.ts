import InverterService from './api/services/InverterService.js';
import ChargerService from './api/services/ChargerService.js';
import BatteryService from './api/services/BatteryService.js'
import LiveData from './classes/LiveData.js';
import WebSocketManager from './classes/WebSocketManager.js';
import ConfigFile from './classes/ConfigFile.js';
import ConfigInterface from './models/ConfigInterface.js';
import LiveDataInterface from './models/LiveDataInterface.js';

const CAR_NOT_CHARGING = 2; // Replace with an appropriate descriptive constant

export default async function (): Promise<void> {
	console.log('////////////////////////////');

	LiveData.data = LiveData.defaultData;

	const config: ConfigInterface = ConfigFile.read();

	const inverterData = await InverterService.getPowerFlowRealtimeData();
	const chargerData = await ChargerService.getChargeInfo();
	const batteryData = await BatteryService.getEMSDATA();

	if (inverterData) {
		LiveData.data.Inverter.Status = 1; // Idle;
		LiveData.data.Inverter.Export = inverterData.Body.Data.Site.P_Grid * -1;
		LiveData.data.Inverter.SunPower = inverterData.Body.Data.Site.P_PV;
	}

	if (chargerData) {
		LiveData.data.Charger.Status = chargerData.car;
		LiveData.data.Charger.Amp = chargerData.amp;
		LiveData.data.Charger.Consumption = chargerData.nrg[11];
	}

	if (batteryData) {
		const stateMappings: { [key: string]: LiveDataInterface['Battery']['Status'] } = {
			'0': 0, // Busy
			'1': 1, // Activ-Modus
			'2': 2, // Laden
			'3': 3, // Entladen
			'4': 4, // Standby
			'5': 5, // Fehlerzustand
			'6': 6, // Passiv-Modus
			'7': 7, // Notstrombetrieb
		};
		const batteryStatus = stateMappings[batteryData.root.inverter.var.find(v => v.name === "State").value] || 'OFFLINE';
		LiveData.data.Battery.Status = batteryStatus;
		LiveData.data.Battery.Percent = parseFloat(batteryData.root.inverter.var.find(v => v.name === "SOC").value.slice(0, -1));
		LiveData.data.Battery.Power = parseFloat(batteryData.root.inverter.var.find(v => v.name === "P").value)
	}

	const result = calculateChargeSettings(config);
	Object.assign(LiveData.data.Charger, result);
	if (!config.Enabled) {
		console.log('Control not enabled!');
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (!chargerData || !inverterData) {
		console.log('Stop charging - one not available');
		ChargerService.setChargeStop();
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (LiveData.data.Charger.ShouldStop && !config.UsePowergrid) {
		console.log('Should stop is true and use powergrid set to false');
		await ChargerService.setChargeStop();
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (chargerData.car !== CAR_NOT_CHARGING) {
		console.log('Car is not charging, setting charge true!');
		await ChargerService.setChargeStart();
	}

	if (chargerData.amp !== LiveData.data.Charger.AmpCalc) {
		console.log('Amp was corrected');
		const response = await ChargerService.setChargeAmp(LiveData.data.Charger.AmpCalc);
		if (response.amp === true) {
			LiveData.data.Charger.Amp = LiveData.data.Charger.AmpCalc;
		}
	}

	WebSocketManager.sendEventLiveData();
	console.log('Done');
}

function findClosestValue(key: number, mappingArray: any[]): any {
	return mappingArray.reduce((prev, curr) => {
		// If the current value is closer or the same distance to the key than the previous
		// and is not more than the key, then consider it as the closest value.
		if (Math.abs(curr.value - key) <= Math.abs(prev.value - key) && curr.value <= key) {
			return curr;
		}
		return prev;
	});
}

function calculateChargeSettings(config) {
	const availablePower = LiveData.data.Inverter.Export + LiveData.data.Charger.Consumption;

	// Find the amp value that matches the available power the closest
	const optimalAmpereMapping = findClosestValue(availablePower, config.Mapping);

	let determinedAmp = optimalAmpereMapping.amp;

	// Ensure the calculated amp value lies between the Minimum and Maximum values
	if (determinedAmp < config.MinimumAmps) {
		determinedAmp = config.MinimumAmps;
	} else if (determinedAmp > config.MaximumAmps) {
		determinedAmp = config.MaximumAmps;
	}

	let shouldStop = false;

	// If the available power is less than the value for MinimumAmps, then consider stopping
	if (availablePower < findClosestValue(determinedAmp, config.Mapping).value) {
		shouldStop = true;
	}
	return {
		Reserved: availablePower,
		AmpCalc: determinedAmp,
		ShouldStop: shouldStop
	};
}
