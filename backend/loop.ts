import InverterService from './api/services/InverterService.js';
import ChargerService from './api/services/ChargerService.js';
import BatteryService from './api/services/BatteryService.js';
import LiveData from './classes/LiveData.js';
import WebSocketManager from './classes/WebSocketManager.js';
import ConfigFile from './classes/ConfigFile.js';
import ConfigInterface from './models/ConfigInterface.js';
import LiveDataInterface from './models/LiveDataInterface.js';
import infoLog from './functions/infoLog.js';

const CAR_NOT_CHARGING = 2; // Replace with an appropriate descriptive constant

export default async function (): Promise<void> {
	console.log('\n---------------------------------------------------------------');
	infoLog('LOOP (' + ConfigFile.read().CheckSeconds + 's) --------------------|');

	LiveData.data = LiveData.defaultData;

	const config: ConfigInterface = ConfigFile.read();

	const mainInverterPowerFlow = await InverterService.getPowerFlowRealtimeData(
		ConfigFile.read().MainInverterHost
	);
	const Inverter1PowerFlow = await InverterService.getPowerFlowRealtimeData(
		ConfigFile.read().InverterHost1
	);
	//const inverterMeter = await InverterService.getMeterRealtimeData();
	const chargerData = await ChargerService.getChargeInfo();
	const batteryData = await BatteryService.getEMSDATA();

	if (mainInverterPowerFlow) {
		LiveData.data.MainInverter.Status = 1;
		LiveData.data.Inverter.Export = mainInverterPowerFlow.Body.Data.Site.P_Grid * -1;
		LiveData.data.Inverter.SunPower = mainInverterPowerFlow.Body.Data.Site.P_PV;
	}

	if (Inverter1PowerFlow) {
		LiveData.data.Inverter1.Status = 1;
		LiveData.data.Inverter.SunPower += Inverter1PowerFlow.Body.Data.Site.P_PV;
	}

	if (chargerData) {
		LiveData.data.Charger.Status = chargerData.car;
		LiveData.data.Charger.Amp = chargerData.amp;
		LiveData.data.Charger.Consumption = chargerData.nrg[11];
		LiveData.data.Charger.LinkTime = chargerData.lccfi ?? 0;
		LiveData.data.Charger.ChargedSinceLink = chargerData.wh;
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
			'7': 7 // Notstrombetrieb
		};
		const batteryStatus =
			stateMappings[batteryData.root.inverter.var.find((v) => v.name === 'State').value] ||
			'OFFLINE';
		LiveData.data.Battery.Status = batteryStatus;

		let val = parseFloat(batteryData.root.inverter.var.find((v) => v.name === 'SOC').value);
		LiveData.data.Battery.Percent = !isNaN(val)
			? Math.min(Math.max(0, Math.round(val > 100 ? val / 10 : val)), 100)
			: 0;

		LiveData.data.Battery.Power = parseFloat(
			batteryData.root.inverter.var.find((v) => v.name === 'P').value
		);
	}

	const result = calculateChargeSettings(config);
	Object.assign(LiveData.data.Charger, result);
	if (!config.Enabled) {
		infoLog('Control not enabled!');
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (!chargerData || !mainInverterPowerFlow) {
		infoLog('Stop charging - one not available');
		ChargerService.setChargeStop();
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (LiveData.data.Charger.ShouldStop && !config.UsePowergrid) {
		infoLog('Should stop is true and use powergrid set to false');
		await ChargerService.setChargeStop();
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (chargerData.car !== CAR_NOT_CHARGING) {
		infoLog('Car is not charging, setting charge true!');
		await ChargerService.setChargeStart();
	}

	if (chargerData.amp !== LiveData.data.Charger.AmpCalc) {
		infoLog('Amp was corrected');
		const response = await ChargerService.setChargeAmp(LiveData.data.Charger.AmpCalc);
		if (response.amp === true) {
			LiveData.data.Charger.Amp = LiveData.data.Charger.AmpCalc;
		}
	}

	WebSocketManager.sendEventLiveData();
	infoLog('Done');
}

function findClosestValue(key: number, mappingArray: any[]): any {
	// if length is zero just return a preset value indicating 'None'
	if (mappingArray.length === 0) {
		// Find the amp value that matches the available power the closest
		type MappingItemType = ConfigInterface['Mapping'][0];
		const response: MappingItemType = { value: 0, amp: 0 };
		return response;
	}

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
