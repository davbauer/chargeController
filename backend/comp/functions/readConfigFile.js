import * as fs from 'fs';
import errorLog from '../functions/errorLog.js';
export default function (filePath) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContents);
        if (isValidConfig(data)) {
            return data;
        }
        else {
            errorLog('readConfigFile: Config validation failed');
            return null;
        }
    }
    catch (error) {
        errorLog(`readConfigFile: Error reading or parsing config: ${error}`);
        return null;
    }
}
function isValidConfig(data) {
    return typeof data.Enabled === 'boolean' &&
        typeof data.InverterHost === 'string' &&
        typeof data.ChargerHost === 'string' &&
        typeof data.CheckSeconds === 'number' &&
        typeof data.MinimumAmps === 'number' &&
        typeof data.MaximumAmps === 'number' &&
        typeof data.UsePowergrid === 'boolean';
}
