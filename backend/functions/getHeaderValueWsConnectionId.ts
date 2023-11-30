import { Request } from 'express';
import errorLog from './errorLog';

export default function getWsConnectionHeaderValue(req: Request): string {
	const wsConnectionId = req.headers['x-ws-connection-id'];

	if (!wsConnectionId || typeof wsConnectionId !== 'string') {
		errorLog(
			`WebSocket connection ID header missing or invalid. Method: ${req.method}, Path: ${req.path}`
		);
		return 'undefined';
	}

	return wsConnectionId;
}
