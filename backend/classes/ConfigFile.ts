import * as fs from 'fs';
import ConfigInterface from '../models/ConfigInterface.js';
import errorLog from '../functions/errorLog.js';
import infoLog from '../functions/infoLog.js';
import * as path from 'path';
// ... other imports ...

export default class {
	private static cachedConfig: ConfigInterface | null = null;
	private static filePath = './config/config.json';

	private static createDefaultConfig(): ConfigInterface {
		const defaultConfig = {
			Mapping: [],
			Enabled: false,
			MainInverterHost: 'myhostname',
			InverterHost1: 'myhostname',
			ChargerHost: 'myhostname',
			BatteryHost: 'myhostname',
			CheckSeconds: 30,
			MinimumAmps: 6,
			MaximumAmps: 14,
			UsePowergrid: false,
			BatteryCapacity: 52000,
			CarEfficiency: 150
		};
		const dirPath = path.dirname(this.filePath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true }); // 'recursive' ensures all directories are created if they don't exist
		}

		this.write(defaultConfig);
		return defaultConfig;
	}

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
				return this.createDefaultConfig();
			}
		} catch (error) {
			if (error.code === 'ENOENT') {
				// Check if the error is because the file doesn't exist
				infoLog('ConfigFile.read: Config file not found. Creating default config.');
				return this.createDefaultConfig();
			}
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
			Array.isArray(data.Mapping) &&
			data.Mapping.every(
				(item) => typeof item.amp === 'number' && typeof item.value === 'number'
			) &&
			typeof data.Enabled === 'boolean' &&
			typeof data.MainInverterHost === 'string' &&
			typeof data.InverterHost1 === 'string' &&
			typeof data.ChargerHost === 'string' &&
			typeof data.BatteryHost === 'string' &&
			typeof data.CheckSeconds === 'number' &&
			typeof data.MinimumAmps === 'number' &&
			typeof data.MaximumAmps === 'number' &&
			typeof data.UsePowergrid === 'boolean' &&
			typeof data.CarEfficiency === 'number' &&
			typeof data.BatteryCapacity === 'number'
		);
	}
}
