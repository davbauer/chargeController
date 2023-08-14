import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './routes/swaggerOptions.js';
import loop from './loop.js';
import infoLog from './functions/infoLog.js';
import LoopHandler from './classes/LoopHandler.js';
import WebSocketManager from './classes/WebSocketManager.js';
import chargeRoutes from './routes/chargeRoutes.js';
import configRoutes from './routes/configRoutes.js';
import enabledRoutes from './routes/enabledRoutes.js';
import livedataRoutes from './routes/livedataRoutes.js';

const WEBSOCK_PORT = 2001;
const EXPRESS_PORT = 2000;
const app = express();
app.use(morgan('tiny'));
app.use(express.json());
app.use(
	cors({
		origin: '*' // Only allow requests from this origin
	})
);
app.get('/api-docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpecs);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(express.static('./svelte-build'));
app.use('/', chargeRoutes);
app.use('/', configRoutes);
app.use('/', enabledRoutes);
app.use('/', livedataRoutes);

const server = app.listen(EXPRESS_PORT, '0.0.0.0', () => {
	console.log('');
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
