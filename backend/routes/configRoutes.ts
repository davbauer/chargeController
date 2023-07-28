import express from 'express';
import ConfigFile from '../classes/ConfigFile.js';
import ConfigInterface from '../models/ConfigInterface.js';
import LoopHandler from '../classes/LoopHandler.js';
import loop from '../loop.js';
import errorLog from '../functions/errorLog.js';


const r = express.Router();

function getSwaggerSchemaFromTypeScript<T extends object>(sampleObject: T): object {
    const schema: any = {
        type: 'object',
        properties: {}
    };

    for (const key of Object.keys(sampleObject)) {
        const type = typeof sampleObject[key];
        schema.properties[key] = { type: type };
    }

    return schema;
}

/**
 * @swagger
 * /config:
 *   get:
 *     summary: Retrieve the current configuration
 *     tags:
 *       - Configuration
 *     responses:
 *       200:
 *         description: Current configuration object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConfigInterface'
 *                 
 */
r.get('/config', (req, res) => {
    const configObject: ConfigInterface = ConfigFile.read();
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
 *         description: Configuration updated successfully
 *       500:
 *         description: Error writing to config file
 */
r.post('/config', (req, res) => {
    const configData: ConfigInterface = req.body;
    const updateLoop = ConfigFile.read().CheckSeconds !== configData.CheckSeconds;
    const success = ConfigFile.write(configData);
    if (success) {
        if (updateLoop) {
            console.log('Configuration updated. Restarting loop with new settings.');
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
