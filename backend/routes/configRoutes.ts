import express from 'express';
import ConfigFile from '../classes/ConfigFile.js';
import InterfaceConfig from '../models/InterfaceConfig.js';
import LoopHandler from '../classes/LoopHandler.js';
import loop from '../loop.js';
import errorLog from '../functions/errorLog.js';
import infoLog from '../functions/infoLog.js';

const r = express.Router();

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Retrieve the current configuration
 *     tags:
 *       - Configuration
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InterfaceConfig'
 *
 */
r.get('/config', (_req, res) => {
	const configObject: InterfaceConfig = ConfigFile.read();
	res.json(configObject);
});

/**
 * @swagger
 * /config:
 *   post:
 *     summary: Update the current configuration
 *     tags:
 *       - Configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfigInterface'
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error
 */
r.post('/config', (req, res) => {
	const configData: InterfaceConfig = req.body;
	const updateLoop = ConfigFile.read().CheckSeconds !== configData.CheckSeconds;
	const success = ConfigFile.write(configData);
	if (success) {
		if (updateLoop) {
			infoLog('Configuration updated. Restarting loop with new settings.');
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
