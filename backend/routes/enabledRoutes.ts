import express from 'express';
import ConfigFile from '../classes/ConfigFile.js';
import ConfigInterface from '../models/ConfigInterface.js';
import LoopHandler from '../classes/LoopHandler.js';
import loop from '../loop.js';
import errorLog from '../functions/errorLog.js';
import WebSocketManager from '../classes/WebSocketManager.js';
import ChargerService from '../api/services/ChargerService.js';

const r = express.Router()

r.post('/enabled', async (req, res) => {
    const stateData: boolean = req.body.state;
    const configData: ConfigInterface = ConfigFile.read();
    const updateLoop = ConfigFile.read().Enabled !== stateData;
    configData.Enabled = stateData;
    const success = ConfigFile.write(configData);
    WebSocketManager.sendEventEnabledState(stateData);
    if (success) {
        if (stateData === false) {
            await ChargerService.setChargeStop();
        }
        if (updateLoop) {
            console.log('Configuration updated. Restarting loop with new settings.');
            LoopHandler.updateLoop(loop);
        }
        res.status(200).json({ msg: 'success' });
    } else {
        errorLog('Error writing enabled state to config file.');
        res.status(500).json({
            msg: 'Error writing to config file'
        });
    }
});

export default r;