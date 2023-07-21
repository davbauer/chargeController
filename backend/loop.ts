
import InverterService from './api/services/InverterService.js'
import ChargerService from './api/services/ChargerService.js'
import LiveData from './classes/LiveData.js'
import WebSocketManager from './classes/WebSocketManager.js';

export default async function (): Promise<void> {
    console.log("////////////////////////////");
    console.log("////////////////////////////");
    console.log("////////////////////////////");

    LiveData.data = {
        StatusInverter: 'OFFLINE',
        StatusCharger: 'OFFLINE',
        Export: -1,
        ChargerReserved: -1,
        ChargerAmp: -1,
        ChargerUse: -1
    }

    // Get data from the inverter
    const inverterData = await InverterService.getRealtimeData();

    // Check if inverter data is available
    if (inverterData !== undefined) {
        LiveData.data.StatusInverter = 1 // Idle;
        const exportEnergy = inverterData.Body.Data["0"].PowerReal_P_Sum * -1;
        LiveData.data.Export = exportEnergy;
    }

    // Get data from the charger
    const chargerData = await ChargerService.getChargeInfo();

    // Check if charger data is available
    if (chargerData !== undefined) {
        LiveData.data.StatusCharger = chargerData.car;
        LiveData.data.ChargerAmp = chargerData.amp;
        LiveData.data.ChargerUse = chargerData.nrg[11];
        console.log(JSON.stringify(chargerData, null, 4));
        // Perform other charger-related calculations or actions here
    }

    console.log(JSON.stringify(LiveData.data, null, 4));

    // Stop when one of these things not available
    if (chargerData === undefined || inverterData === undefined) {
        console.log("Stop charging one not available")
        ChargerService.setChargeStop();
        WebSocketManager.sendEvent("liveDataUpdate", LiveData.data);
        return
    }
    WebSocketManager.sendEvent("liveDataUpdate", LiveData.data);
    console.log("my calculations etc etc")
}
