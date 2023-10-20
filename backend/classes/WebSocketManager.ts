import * as ws from 'ws';
import LiveData from './LiveData.js';
import infoLog from '../functions/infoLog.js';

export default class WebSocketManager {
	private static wss: ws.WebSocketServer | null = null;
	private static clients: ws.WebSocket[] = [];

	public static init(port: number): void {
		if (this.wss) {
			throw new Error('WebSocket server is already initialized.');
		}

		this.wss = new ws.WebSocketServer({ port, host: '0.0.0.0' });

		this.wss.on('connection', (clientWs: ws.WebSocket) => {
			this.clients.push(clientWs);
			infoLog(`WS Client connection established (Id: ${this.clients.length - 1})`);
			// Send initial data to the client immediately upon connection.
			clientWs.send(
				JSON.stringify({
					event: 'liveDataUpdate',
					data: LiveData.data
				})
			);

			clientWs.on('close', () => {
				const index = this.clients.indexOf(clientWs);
				if (index !== -1) {
					this.clients.splice(index, 1);
				}
				infoLog(`WS Client connection closed (Id: ${index})`);
			});
		});
	}
	public static sendEventLiveData() {
		LiveData.data.Timestamp = new Date();
		this.sendEvent('liveDataUpdate', LiveData.data);
	}

	public static sendEventEnabledState(state: boolean) {
		this.sendEvent('enabledStateUpdate', { state });
	}

	public static sendEventEnabledPowergridState(state: boolean) {
		this.sendEvent('enabledPowergridStateUpdate', { state });
	}

	public static sendEvent(eventType: string, data: any): void {
		const jsonData = JSON.stringify({ event: eventType, data });

		for (let clientWs of this.clients) {
			if (clientWs.readyState === 1) {
				// Ensure WebSocket is open before sending
				clientWs.send(jsonData);
			}
		}
	}

	public static close(): void {
		// Close all client connections
		for (let clientWs of this.clients) {
			if (clientWs.readyState !== clientWs.CLOSED) {
				clientWs.close();
			}
		}
		this.clients = []; // Clear the clients array

		// Close the WebSocket server
		if (this.wss) {
			this.wss.close();
			this.wss = null;
		}
	}
}
