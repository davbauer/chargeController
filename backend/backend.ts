import express from 'express';
import cors from 'cors';
import ConfigFile from './classes/ConfigFile.js';
import Config from './models/Config.js';
import infoLog from './functions/infoLog.js';
import errorLog from './functions/errorLog.js';
import morgan from 'morgan';
import LoopHandler from './classes/LoopHandler.js';
import loop from './loop.js';
import WebSocketManager from './classes/WebSocketManager.js'
import ChargerService from './api/services/ChargerService.js';


const WEBSOCK_PORT = 2001;
const EXPRESS_PORT = 2000;
const app = express();
app.use(morgan('tiny'))
app.use(express.json());
process.env.Staging
app.use(cors({
    origin: '*'  // Only allow requests from this origin
}));

const loopHandler = new LoopHandler();

app.get('/config', (req, res) => {
    const configObject: Config = ConfigFile.read();
    res.json(configObject);
});

app.post('/config', (req, res) => {
    const configData: Config = req.body;
    const updateLoop = ConfigFile.read().CheckSeconds !== configData.CheckSeconds;
    const success = ConfigFile.write(configData);
    if (success) {

        if (updateLoop) {
            console.log('Configuration updated. Restarting loop with new settings.');
            loopHandler.updateLoop(loop)
        }
        res.status(200).json({ msg: 'success' });
    } else {
        errorLog('Error writing to config file.');
        res.status(500).json({
            msg: 'Error writing to config file',
        });
    }
});

app.post('/enabled', (req, res) => {
    const stateData: boolean = req.body.state;
    const configData: Config = ConfigFile.read();
    configData.Enabled = stateData;
    const success = ConfigFile.write(configData);
    WebSocketManager.sendEvent("enabledStateUpdate", { state: stateData });
    if (success) {
        res.status(200).json({ msg: 'success' });
    } else {
        errorLog('Error writing enabled state to config file.');
        res.status(500).json({
            msg: 'Error writing to config file',
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
    console.info(`\n------------------------------------------\nExpress running at http://localhost:${EXPRESS_PORT}`);
    WebSocketManager.init(WEBSOCK_PORT);
    console.info(`WebSocket running at http://localhost:${WEBSOCK_PORT}\n------------------------------------------\n`);
    loopHandler.startLoop(loop);
});

process.on('SIGINT', () => {
    infoLog('Gracefully shutting down from SIGINT (Ctrl+C)');
    loopHandler.stopLoop();
    server.close(() => {
        process.exit();
    });
});
