import * as fs from 'fs';
import InterfaceConfig from '../models/InterfaceConfig.js';
import errorLog from '../functions/errorLog.js';
import infoLog from '../functions/infoLog.js';
import * as path from 'path';

export default class {
	private static cachedConfig: InterfaceConfig | null = null;
	private static filePath = './config/config.json';

	private static createDefaultConfig(): InterfaceConfig {
		const defaultConfig: InterfaceConfig = {
			Enabled: false,
			UsePowergrid: false,
			PreferredPhase: 0,
			CheckSeconds: 30,
			MainInverterHost: 'myhostname',
			InverterHost1: 'myhostname',
			ChargerHost: 'myhostname',
			BatteryHost: 'myhostname',
			MinimumWatts: 50,
			MaximumWatts: 100000,
			BatteryCapacity: 52000,
			CarEfficiency: 200,
			Mapping: [
				{
					amp: 6,
					value: 300,
					onePhase: false
				},
				{
					amp: 6,
					value: 100,
					onePhase: true
				},
				{
					amp: 7,
					value: 200,
					onePhase: true
				},
				{
					amp: 7,
					value: 300,
					onePhase: false
				},
				{
					amp: 8,
					value: 4400,
					onePhase: false
				},
				{
					amp: 9,
					value: 6000,
					onePhase: false
				},
				{
					amp: 10,
					value: 6740,
					onePhase: false
				}
			]
		};
		const dirPath = path.dirname(this.filePath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true }); // 'recursive' ensures all directories are created if they don't exist
		}

		this.write(defaultConfig);
		return defaultConfig;
	}

	static read(): InterfaceConfig {
		if (this.cachedConfig) {
			return this.cachedConfig;
		}

		try {
			const fileContents = fs.readFileSync(this.filePath, 'utf-8');
			const data: any = JSON.parse(fileContents);
			if (this.isValidConfig(data)) {
				return data as InterfaceConfig;
			} else {
				errorLog('ConfigFile.read: Config validation failed');
				return this.createDefaultConfig();
			}
		} catch (error: any) {
			if (error.code === 'ENOENT') {
				// Check if the error is because the file doesn't exist
				infoLog('ConfigFile.read: Config file not found. Creating default config.');
				return this.createDefaultConfig();
			}
			errorLog(`ConfigFile.read: Error reading or parsing config: ${error}`);
			throw `ConfigFile.read: Error reading or parsing config: ${error}`;
		}
	}
	static write(config: InterfaceConfig): boolean {
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

	private static isValidConfig(data: any): data is InterfaceConfig {
		return (
			Array.isArray(data.Mapping) &&
			data.Mapping.every(
				(item: any) =>
					typeof item.amp === 'number' &&
					typeof item.value === 'number' &&
					typeof item.onePhase === 'boolean'
			) &&
			typeof data.Enabled === 'boolean' &&
			typeof data.MainInverterHost === 'string' &&
			typeof data.InverterHost1 === 'string' &&
			typeof data.ChargerHost === 'string' &&
			typeof data.BatteryHost === 'string' &&
			typeof data.CheckSeconds === 'number' &&
			typeof data.MinimumWatts === 'number' &&
			typeof data.MaximumWatts === 'number' &&
			typeof data.UsePowergrid === 'boolean' &&
			typeof data.CarEfficiency === 'number' &&
			typeof data.BatteryCapacity === 'number'
		);
	}
}
