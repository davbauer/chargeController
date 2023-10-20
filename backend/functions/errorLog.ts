import WebSocketManager from '../classes/WebSocketManager.js';

export default function (input: any) {
	const ts = new Date().toLocaleString('en-US');
	console.error(`[ERR] ${ts} -> ${input}`);
	WebSocketManager.sendEventBackendTerminal('error', input);
}
