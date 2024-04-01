import InverterService from './api/services/InverterService.js';
import ChargerService from './api/services/ChargerService.js';
import BatteryService from './api/services/BatteryService.js';
import LiveData from './classes/LiveData.js';
import WebSocketManager from './classes/WebSocketManager.js';
import ConfigFile from './classes/ConfigFile.js';
import InterfaceConfig from './models/InterfaceConfig.js';
import LiveDataInterface from './models/InterfaceLiveData.js';
import infoLog from './functions/infoLog.js';
import errorLog from './functions/errorLog.js';

const CAR_CHARGING = 2;
const CAR_WAIT = 3;

export default async function (): Promise<void> {
	infoLog('\n---------------------------------------------------------------');
	infoLog('LOOP (' + ConfigFile.read().CheckSeconds + 's) --------------------|');

	LiveData.setDefault();
	const config: InterfaceConfig = ConfigFile.read();

	infoLog(`Mode: '${config.Mode}'`);

	const mainInverterPowerFlow = await InverterService.getPowerFlowRealtimeData(
		ConfigFile.read().MainInverterHost
	);
	const Inverter1PowerFlow = await InverterService.getPowerFlowRealtimeData(
		ConfigFile.read().InverterHost1
	);

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
		LiveData.data.Charger.PhaseMode = chargerData.psm;
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
		let stateVar = batteryData.root.inverter.var.find((v: any) => v.name === 'State')?.value;

		if (stateVar) {
			LiveData.data.Battery.Status = stateMappings[stateVar] || 'OFFLINE';
		} else {
			LiveData.data.Battery.Status = 'OFFLINE';
		}

		const socVar = batteryData.root.inverter.var.find((v: any) => v.name === 'SOC')?.value;
		if (socVar) {
			const val = parseFloat(socVar);
			LiveData.data.Battery.Percent = !isNaN(val)
				? Math.min(Math.max(0, Math.round(val > 100 ? val / 10 : val)), 100)
				: 0;
		}

		const pVar = batteryData.root.inverter.var.find((v: any) => v.name === 'P')?.value;

		if (pVar) {
			LiveData.data.Battery.Power = parseFloat(pVar);
		}
	}

	const result = calculateChargeSettings(config);
	Object.assign(LiveData.data.Charger, result);
	if (config.Mode === 'force_off') {
		if (LiveData.data.Charger.Status === CAR_CHARGING) {
			infoLog('Car is charging -> forcing off!');
			await ChargerService.setChargeStop();
		}
		WebSocketManager.sendEventLiveData();
		return;
	}
	if (config.Mode === 'sleep') {
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (!chargerData || !mainInverterPowerFlow) {
		infoLog('Stop charging - no charger- or inverterdata available');
		ChargerService.setChargeStop();
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (LiveData.data.Charger.ShouldStop && config.Mode === 'sun') {
		infoLog(`Should stop is true and 'sun_force' not enabled`);
		await ChargerService.setChargeStop();
		WebSocketManager.sendEventLiveData();
		return;
	}

	if (chargerData.car !== CAR_CHARGING) {
		if (chargerData.car === CAR_WAIT) {
			infoLog('No car to charger connected, cant charge!');
			return;
		}
		infoLog('Car is not charging, setting charge true!');
		await ChargerService.setChargeStart();
	}

	if (chargerData.psm !== LiveData.data.Charger.PhaseModeCalc) {
		infoLog(`Phase was corrected (${chargerData.psm} -> ${LiveData.data.Charger.PhaseModeCalc})`);
		const response = await ChargerService.setChargePhase(LiveData.data.Charger.PhaseModeCalc);
		if (response && response.psm === LiveData.data.Charger.PhaseModeCalc) {
			LiveData.data.Charger.PhaseMode = LiveData.data.Charger.PhaseModeCalc;
		}
	}

	if (chargerData.amp !== LiveData.data.Charger.AmpCalc) {
		infoLog(`Amp was corrected (${chargerData.amp} -> ${LiveData.data.Charger.AmpCalc})`);
		const response = await ChargerService.setChargeAmp(LiveData.data.Charger.AmpCalc);
		if (response && response.amp === true) {
			LiveData.data.Charger.Amp = LiveData.data.Charger.AmpCalc;
		}
	}

	WebSocketManager.sendEventLiveData();
	infoLog('Done');
}

function findClosestValue(availablePower: number, mappingArray: any[]): any {
	const configFile = ConfigFile.read();
	const preferredPhase = configFile.PreferredPhase;
	const minimumWatts = configFile.MinimumWatts;
	const maximumWatts = configFile.MaximumWatts;

	// Filter the mappings based on the preferredPhase and power constraints.
	const filteredMappings = mappingArray.filter((item) => {
		return (
			(preferredPhase === 0 || // 0 for auto (accept all)
				(preferredPhase === 1 && item.onePhase) || // 1 for phase 1
				(preferredPhase === 2 && !item.onePhase)) && // 2 for phase 3
			item.value >= minimumWatts &&
			item.value <= maximumWatts
		); // within min and max power range
	});

	// If there are no mappings left after filtering, return a default response.
	if (filteredMappings.length === 0) {
		errorLog('No mappings available for the preferred phase or within the power constraints.');
		type MappingItemType = InterfaceConfig['Mapping'][0];
		const response: MappingItemType = { value: 0, amp: 0, onePhase: false };
		return response;
	}

	// Find the mapping that is closest to availablePower.
	const optimalMapping = filteredMappings.reduce((prev, curr) => {
		return Math.abs(curr.value - availablePower) < Math.abs(prev.value - availablePower)
			? curr
			: prev;
	});

	return optimalMapping;
}

function calculateChargeSettings(config: InterfaceConfig) {
	const availablePower =
		LiveData.data.Inverter.Export + LiveData.data.Charger.Consumption + config.OffsetWatts;

	// Find the amp value that matches the available power the closest
	const optimalAmpereMapping = findClosestValue(availablePower, config.Mapping);

	let determinedAmp = optimalAmpereMapping.amp;
	let determinedPhase = optimalAmpereMapping.onePhase;
	let determinedValue = optimalAmpereMapping.value;

	// Ensure the calculated watt value lies between the Minimum and Maximum values
	if (determinedValue < config.MinimumWatts) {
		determinedValue = config.MinimumWatts;
	} else if (determinedValue > config.MaximumWatts) {
		determinedValue = config.MaximumWatts;
	}

	let shouldStop = false;

	// If the available power is less than the value for MinimumAmps, then consider stopping
	if (availablePower < optimalAmpereMapping.value) {
		shouldStop = true;
	}
	return {
		Reserved: availablePower,
		AmpCalc: determinedAmp,
		PhaseModeCalc: determinedPhase ? 1 : 2,
		ShouldStop: shouldStop
	};
}
