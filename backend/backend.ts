import express from 'express';
import cors from 'cors';
import ConfigFile from './classes/ConfigFile.js';
import ConfigInterface from './models/ConfigInterface.js';
import infoLog from './functions/infoLog.js';
import errorLog from './functions/errorLog.js';
import morgan from 'morgan';
import LoopHandler from './classes/LoopHandler.js';
import loop from './loop.js';
import WebSocketManager from './classes/WebSocketManager.js';
import ChargerService from './api/services/ChargerService.js';

const WEBSOCK_PORT = 2001;
const EXPRESS_PORT = 2000;
const app = express();
app.use(morgan('tiny'));
app.use(express.json());
process.env.Staging;
app.use(
    cors({
        origin: '*' // Only allow requests from this origin
    })
);
app.use(express.static('./svelte-build'));

const loopHandler = new LoopHandler();

app.get('/config', (req, res) => {
    const configObject: ConfigInterface = ConfigFile.read();
    res.json(configObject);
});

app.post('/config', (req, res) => {
    const configData: ConfigInterface = req.body;
    const updateLoop = ConfigFile.read().CheckSeconds !== configData.CheckSeconds;
    const success = ConfigFile.write(configData);
    if (success) {
        if (updateLoop) {
            console.log('Configuration updated. Restarting loop with new settings.');
            loopHandler.updateLoop(loop);
        }
        res.status(200).json({ msg: 'success' });
    } else {
        errorLog('Error writing to config file.');
        res.status(500).json({
            msg: 'Error writing to config file'
        });
    }
});
app.post('/enabled', async (req, res) => {
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
            loopHandler.updateLoop(loop);
        }
        res.status(200).json({ msg: 'success' });
    } else {
        errorLog('Error writing enabled state to config file.');
        res.status(500).json({
            msg: 'Error writing to config file'
        });
    }
});

app.post('/charge-start', (req, res) => {
    ChargerService.setChargeStart();
    res.status(200).json({ msg: 'success' });
});
app.post('/charge-stop', (req, res) => {
    ChargerService.setChargeStop();
    res.status(200).json({ msg: 'success' });
});

const server = app.listen(EXPRESS_PORT, '0.0.0.0', () => {
    console.info(
        `\n------------------------------------------\nExpress running at http://localhost:${EXPRESS_PORT}`
    );
    WebSocketManager.init(WEBSOCK_PORT);
    console.info(
        `WebSocket running at http://localhost:${WEBSOCK_PORT}\n------------------------------------------\n`
    );
    loopHandler.startLoop(loop);
});

process.on('SIGINT', () => {
    infoLog('Gracefully shutting down from SIGINT (Ctrl+C)');
    loopHandler.stopLoop();
    WebSocketManager.close();
    server.close(() => {
        process.exit();
    });
});
