import express from 'express';
import AppInfo from '../classes/AppInfo.js';

const r = express.Router();

/**
 * @swagger
 * /appinfo:
 *   get:
 *     summary: Retrieve app info
 *     tags:
 *       - AppInfo
 *     description: Get data based on InterfaceAppInfo model.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InterfaceAppInfo'
 */
r.get('/appinfo', (_req, res) => {
	res.json(AppInfo.get());
});

export default r;
