import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './routes/swaggerOptions.js';
import loop from './loop.js';
import infoLog from './functions/infoLog.js';
import LoopHandler from './classes/LoopHandler.js';
import WebSocketManager from './classes/WebSocketManager.js';
import chargeRoutes from './routes/chargeRoutes.js';
import configRoutes from './routes/configRoutes.js';
import configModeRoutes from './routes/configModeRoutes.js';
import configPreferredPhase from './routes/configPreferredPhase.js';
import livedataRoutes from './routes/livedataRoutes.js';
import appInfoRoutes from './routes/appInfoRoutes.js';
import AppInfo from './classes/AppInfo.js';

dotenv.config();

const WEBSOCK_PORT: number = AppInfo.get().webSocketPort;
const EXPRESS_PORT = 80;
const app = express();
app.use(morgan('tiny'));
app.use(express.json());
app.use(
	cors({
		origin: '*' // Only allow requests from this origin
	})
);
app.use(
	cors({
		allowedHeaders: ['Content-Type', 'X-Ws-Connection-Id']
	})
);

app.get('/api-docs.json', (_req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpecs);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(express.static('./svelte-build'));
app.use('/', chargeRoutes);
app.use('/', configRoutes);
app.use('/', configPreferredPhase);
app.use('/', configModeRoutes);
app.use('/', livedataRoutes);
app.use('/', appInfoRoutes);

const server = app.listen(EXPRESS_PORT, '0.0.0.0', () => {
	infoLog('');
	infoLog(`STARTED CHANGECONTROLLER -------------|`);
	infoLog(`EXPRESS PORT:${EXPRESS_PORT} --------------------|`);
	WebSocketManager.init(WEBSOCK_PORT);
	infoLog(`WEBSOCK PORT:${WEBSOCK_PORT} --------------------|\n\n`);
	LoopHandler.startLoop(loop);
});

process.on('SIGINT', () => {
	infoLog('Gracefully shutting down from SIGINT (Ctrl+C)');
	LoopHandler.stopLoop();
	WebSocketManager.close();
	server.close(() => {
		process.exit();
	});
});
