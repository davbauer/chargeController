import express from 'express';
import ConfigFile from '../classes/ConfigFile.js';
import errorLog from '../functions/errorLog.js';
import WebSocketManager from '../classes/WebSocketManager.js';
import getWsConnectionHeaderValue from '../functions/getHeaderValueWsConnectionId.js';

const r = express.Router();

/**
 * @swagger
 * /preferredPhase:
 *   post:
 *     summary: Update the use preferredPhase state
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
 *                 description: The new preferredPhase state.
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
r.post('/preferredPhase', async (req, res) => {
	const stateData = req.body.state;
	if (stateData !== 0 && stateData !== 1 && stateData !== 2) {
		res.status(400).json({
			msg: 'Bad Request: state must be 0, 1, or 2'
		});
		return;
	}
	const configData = ConfigFile.read();
	configData.PreferredPhase = stateData;
	const success = ConfigFile.write(configData);

	// It's better to send events after ensuring that data is written successfully.
	if (success) {
		WebSocketManager.sendEventPreferredPhase(stateData, getWsConnectionHeaderValue(req)); // Adjusted position
		res.status(200).json({ msg: 'success' });
	} else {
		errorLog('Error writing preferredPhase state to config file.');
		res.status(500).json({
			msg: 'Error writing to config file'
		});
	}
});

export default r;
