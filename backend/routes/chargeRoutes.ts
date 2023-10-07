import express from 'express';
import ChargerService from '../api/services/ChargerService.js';
import { AxiosError } from 'axios';
import errorLog from '../functions/errorLog.js';

const r = express.Router();

/**
 * @swagger
 * /charge-start:
 *   post:
 *     summary: Start the charging process
 *     tags:
 *       - Charger
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: success
 */
r.post('/charge-start', (_req, res) => {
	ChargerService.setChargeStart()
		.then((x) => {
			if (x.frc === true) {
				res.status(200).json({ msg: 'success' });
			} else {
				throw new AxiosError();
			}
		})
		.catch(() => {
			errorLog('Charge state could not be changed');
			res.status(500).json({ msg: 'error' });
		});
});

/**
 * @swagger
 * /charge-stop:
 *   post:
 *     summary: Stop the charging process
 *     tags:
 *       - Charger
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: success
 */
r.post('/charge-stop', (_req, res) => {
	ChargerService.setChargeStop()
		.then((x) => {
			if (x.frc === true) {
				res.status(200).json({ msg: 'success' });
			} else {
				throw new AxiosError();
			}
		})
		.catch(() => {
			errorLog('Charge state could not be changed');
			res.status(500).json({ msg: 'error' });
		});
});

export default r;
