import InterfaceAppInfo from '../models/InterfaceAppInfo.js';

export default class {
	static get(): InterfaceAppInfo {
		const webSocketPort =
			process.env.WEBSOCK_PORT !== undefined ? Number(process.env.WEBSOCK_PORT) : 81;
		return {
			webSocketPort,
			gitCommitId: process.env.COMMITID || 'undefined',
			gitBranchName: process.env.BRANCH || 'undefined',
			uptime: process.uptime(),
			environment: process.env.NODE_ENV || 'development',
			nodeVersion: process.version
		};
	}
}
