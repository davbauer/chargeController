import InverterService from './api/services/InverterService.js';
import ChargerService from './api/services/ChargerService.js';
import LiveData from './classes/LiveData.js';
import WebSocketManager from './classes/WebSocketManager.js';
import ConfigFile from './classes/ConfigFile.js';
import ConfigInterface from './models/ConfigInterface.js';

const CAR_NOT_CHARGING = 2; // Replace with an appropriate descriptive constant

export default async function (): Promise<void> {
	console.log('////////////////////////////');

	LiveData.data = LiveData.defaultData;

	const config: ConfigInterface = ConfigFile.read();

	const inverterData = await InverterService.getRealtimeData();
	const chargerData = await ChargerService.getChargeInfo();

	if (inverterData) {
		LiveData.data.StatusInverter = 1; // Idle;
		const exportEnergy = inverterData.Body.Data['0'].PowerReal_P_Sum * -1;
		LiveData.data.Export = exportEnergy;
	}

	if (chargerData) {
		LiveData.data.StatusCharger = chargerData.car;
		LiveData.data.LiveChargerAmp = chargerData.amp;
		LiveData.data.ChargerUse = chargerData.nrg[11];
	}

	const result = calculateChargeSettings(config);
	Object.assign(LiveData.data, result);
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

	if (LiveData.data.ShouldStop && !config.UsePowergrid) {
		console.log('Should stop is true and use powergrid set to false');
		await ChargerService.setChargeStop();
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (chargerData.car !== CAR_NOT_CHARGING) {
		console.log('Car is not charging, setting charge true!');
		await ChargerService.setChargeStart();
	}

	if (chargerData.amp !== LiveData.data.CalcChargerAmp) {
		console.log('Amp was corrected');
		const response = await ChargerService.setChargeAmp(LiveData.data.CalcChargerAmp);
		if (response.amp === true) {
			LiveData.data.LiveChargerAmp = LiveData.data.CalcChargerAmp;
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
	const availablePower = LiveData.data.Export + LiveData.data.ChargerUse;

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
		ChargerReserved: availablePower,
		CalcChargerAmp: determinedAmp,
		ShouldStop: shouldStop
	};
}
