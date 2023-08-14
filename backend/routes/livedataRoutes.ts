import express from 'express';
import LiveDataInterface from '../models/LiveDataInterface.js';
import LiveData from '../classes/LiveData.js';

const r = express.Router();

/**
 * @swagger
 * /livedata:
 *   get:
 *     summary: Retrieve live data
 *     tags:
 *       - LiveData
 *     description: Fetches and returns live data based on the LiveDataInterface model.
 *     responses:
 *       200:
 *         description: Live data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LiveDataInterface'
 */
r.get('/livedata', (req, res) => {
	const liveDataObject: LiveDataInterface = LiveData.data;
	res.json(liveDataObject);
});

export default r;
