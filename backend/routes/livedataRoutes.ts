import express from 'express';
import InterfaceLiveData from '../models/InterfaceLiveData.js';
import LiveData from '../classes/LiveData.js';

const r = express.Router();

/**
 * @swagger
 * /livedata:
 *   get:
 *     summary: Retrieve live data
 *     tags:
 *       - LiveData
 *     description: Get data based on InterfaceLiveData model.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InterfaceLiveData'
 */
r.get('/livedata', (_req, res) => {
	const liveDataObject: InterfaceLiveData = LiveData.data;
	res.json(liveDataObject);
});

export default r;
