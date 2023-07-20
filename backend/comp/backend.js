import express from 'express';
import readConfigFile from './functions/readConfigFile.js';
import infoLog from './functions/infoLog.js';
const app = express();
const PORT = 2000;
let chargerAdjustmentInterval;
app.get('/getConfig', (req, res) => {
    const configObject = readConfigFile('./config.json');
    if (configObject === null) {
        return res.status(400).json({
            msg: 'Error parsing config file',
        });
    }
    return res.json(configObject);
});
app.get('/start', (req, res) => {
    chargerAdjustmentInterval = setInterval(() => {
        console.log('Checking and adjusting charger...');
    }, 20000);
    res.send('Started charger adjustment process.');
});
app.get('/stop', (req, res) => {
    clearInterval(chargerAdjustmentInterval);
    res.send('Stopped charger adjustment process.');
});
const server = app.listen(PORT, () => {
    console.info(`\n------------------------------------------\nServer running at http://localhost:${PORT}\n------------------------------------------\n`);
});
process.on('SIGINT', () => {
    infoLog('Gracefully shutting down from SIGINT (Ctrl+C)');
    server.close(() => {
        process.exit();
    });
});
