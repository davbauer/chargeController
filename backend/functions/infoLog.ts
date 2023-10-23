import WebSocketManager from '../classes/WebSocketManager';

export default function (input: any) {
	const ts = new Date().toLocaleString('en-US');
	console.info(`[INFO] ${ts} -> ${input}`);
	WebSocketManager.sendEventBackendTerminal('info', input, ts);
}
