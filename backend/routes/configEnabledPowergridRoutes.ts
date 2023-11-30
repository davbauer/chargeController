import express from 'express';
import ConfigFile from '../classes/ConfigFile.js';
import InterfaceConfig from '../models/InterfaceConfig.js';
import errorLog from '../functions/errorLog.js';
import WebSocketManager from '../classes/WebSocketManager.js';
import getWsConnectionHeaderValue from '../functions/getHeaderValueWsConnectionId.js';

const r = express.Router();

/**
 * @swagger
 * /enabledPowergrid:
 *   post:
 *     summary: Update the use powergrid state
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
 *                 type: 'boolean'
 *                 description: The new powergrid state.
 *                 example: true
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
r.post('/enabledPowergrid', async (req, res) => {
	const stateData: boolean = req.body.state;
	const configData: InterfaceConfig = ConfigFile.read();
	configData.UsePowergrid = stateData;
	const success = ConfigFile.write(configData);
	WebSocketManager.sendEventEnabledPowergridState(stateData, getWsConnectionHeaderValue(req));
	if (success) {
		res.status(200).json({ msg: 'success' });
	} else {
		errorLog('Error writing powergrid state to config file.');
		res.status(500).json({
			msg: 'Error writing to config file'
		});
	}
});

export default r;
