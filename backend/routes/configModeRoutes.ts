import express from 'express';
import ConfigFile from '../classes/ConfigFile.js';
import InterfaceConfig from '../models/InterfaceConfig.js';
import LoopHandler from '../classes/LoopHandler.js';
import loop from '../loop.js';
import errorLog from '../functions/errorLog.js';
import WebSocketManager from '../classes/WebSocketManager.js';
import ChargerService from '../api/services/ChargerService.js';
import infoLog from '../functions/infoLog.js';
import getWsConnectionHeaderValue from '../functions/getHeaderValueWsConnectionId.js';

const r = express.Router();

/**
 * @swagger
 * /mode:
 *   post:
 *     summary: Update the mode state
 *     tags:
 *       - Configuration
 *     description: Post data based on InterfaceConfig model.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               state:
 *                 type: 'string'
 *                 description: The new mode state.
 *                 example: 'sleep'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 msg:
 *                   type: 'string'
 *                   example: 'success'
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 msg:
 *                   type: 'string'
 *                   example: 'Error writing to config file'
 */
r.post('/mode', async (req, res) => {
	const stateData: InterfaceConfig['Mode'] = req.body.state;
	const configData: InterfaceConfig = ConfigFile.read();
	const updateLoop = ConfigFile.read().Mode !== stateData;
	configData.Mode = stateData;
	const success = ConfigFile.write(configData);
	if (success) {
		WebSocketManager.sendEventModeState(stateData, getWsConnectionHeaderValue(req));
		if (stateData === 'force_off') {
			await ChargerService.setChargeStop();
		}
		if (updateLoop) {
			infoLog('Configuration updated. Restarting loop with new settings.');
			LoopHandler.updateLoop(loop);
		}
		res.status(200).json({ msg: 'success' });
	} else {
		errorLog('Error writing mode state to config file.');
		res.status(500).json({
			msg: 'Error writing to config file'
		});
	}
});

export default r;
