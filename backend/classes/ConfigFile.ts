import * as fs from 'fs';
import ConfigInterface from '../models/ConfigInterface.js';
import errorLog from '../functions/errorLog.js';
import infoLog from '../functions/infoLog.js';

export default class {
	private static cachedConfig: ConfigInterface | null = null;
	private static filePath = './config.json';

	static read(): ConfigInterface {
		if (this.cachedConfig) {
			return this.cachedConfig;
		}

		try {
			const fileContents = fs.readFileSync(this.filePath, 'utf-8');
			const data: any = JSON.parse(fileContents);
			if (this.isValidConfig(data)) {
				return data as ConfigInterface;
			} else {
				errorLog('ConfigFile.read: Config validation failed');
				return null;
			}
		} catch (error) {
			errorLog(`ConfigFile.read: Error reading or parsing config: ${error}`);
			return null;
		}
	}

	static write(config: ConfigInterface): boolean {
		try {
			const jsonData = JSON.stringify(config, null, 4);
			fs.writeFileSync(this.filePath, jsonData, 'utf-8');
			this.cachedConfig = config;
			return true;
		} catch (error) {
			errorLog(`ConfigFile.write: Error writing config: ${error}`);
			return false;
		}
	}

	private static isValidConfig(data: any): data is ConfigInterface {
		return (
			typeof data.Enabled === 'boolean' &&
			typeof data.InverterHost === 'string' &&
			typeof data.ChargerHost === 'string' &&
			typeof data.CheckSeconds === 'number' &&
			typeof data.MinimumAmps === 'number' &&
			typeof data.MaximumAmps === 'number' &&
			typeof data.UsePowergrid === 'boolean' &&
			typeof data.BatteryCapacity === 'number'
		);
	}
}
