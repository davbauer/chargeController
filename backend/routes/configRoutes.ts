import express from 'express';
import ConfigFile from '../classes/ConfigFile.js';
import ConfigInterface from '../models/ConfigInterface.js';
import LoopHandler from '../classes/LoopHandler.js';
import loop from '../loop.js';
import errorLog from '../functions/errorLog.js';

const r = express.Router()

r.get('/config', (req, res) => {
    const configObject: ConfigInterface = ConfigFile.read();
    res.json(configObject);
});

r.post('/config', (req, res) => {
    const configData: ConfigInterface = req.body;
    const updateLoop = ConfigFile.read().CheckSeconds !== configData.CheckSeconds;
    const success = ConfigFile.write(configData);
    if (success) {
        if (updateLoop) {
            console.log('Configuration updated. Restarting loop with new settings.');
            LoopHandler.updateLoop(loop);
        }
        res.status(200).json({ msg: 'success' });
    } else {
        errorLog('Error writing to config file.');
        res.status(500).json({
            msg: 'Error writing to config file'
        });
    }
});

export default r;