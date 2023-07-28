import express from 'express';
import ChargerService from '../api/services/ChargerService.js';

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
 *         description: Charge process started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: success
 */
r.post('/charge-start', (req, res) => {
    ChargerService.setChargeStart();
    res.status(200).json({ msg: 'success' });
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
 *         description: Charge process stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: success
 */
r.post('/charge-stop', (req, res) => {
    ChargerService.setChargeStop();
    res.status(200).json({ msg: 'success' });
});

export default r;
