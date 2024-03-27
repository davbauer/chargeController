import * as ws from 'ws';
import { v4 as uuidv4 } from 'uuid';
import LiveData from './LiveData.js';
import infoLog from '../functions/infoLog.js';
import InterfaceConfig from '../models/InterfaceConfig.js';

type WebSocketWithID = ws.WebSocket & { id: string };

export default class WebSocketManager {
	private static wss: ws.WebSocketServer | null = null;
	private static clients: WebSocketWithID[] = [];

	public static init(port: number): void {
		if (this.wss) {
			throw new Error('WebSocket server is already initialized.');
		}

		this.wss = new ws.WebSocketServer({ port, host: '0.0.0.0' });

		this.wss.on('connection', (clientWs: ws.WebSocket) => {
			const clientWithID = clientWs as WebSocketWithID;
			clientWithID.id = uuidv4();

			this.clients.push(clientWithID);
			infoLog(`WS Client connection established (Id: ${clientWithID.id})`);

			clientWithID.on('close', () => {
				const index = this.clients.findIndex((client) => client.id === clientWithID.id);
				if (index !== -1) {
					this.clients.splice(index, 1);
				}
				infoLog(`WS Client connection closed (Id: ${clientWithID.id})`);
			});
		});
	}
	public static sendEventLiveData() {
		LiveData.data.Timestamp = new Date();
		this.sendEvent('liveDataUpdate', LiveData.data);
	}

	public static sendEventModeState(state: InterfaceConfig['Mode'], senderWsConnectionId: string) {
		this.sendEvent('modeStateUpdate', { state }, senderWsConnectionId);
	}

	public static sendEventPreferredPhase(
		state: Pick<InterfaceConfig, 'PreferredPhase'>,
		senderWsConnectionId: string
	) {
		this.sendEvent('preferredPhaseUpdate', { state }, senderWsConnectionId);
	}

	public static sendEventBackendTerminal(type: string, msg: string, ts: string) {
		this.sendEvent('backendTerminalUpdate', { type, msg, ts });
	}

	public static sendEvent(
		eventType: string,
		data: any,
		senderWsConnectionId: string = 'undefined'
	): void {
		// Need to fix this issue later, probably via websocket connection Id, dont dissallow too many connections issue!
		// 20 Oct. 2023 - David
		if (process.uptime() < 3) return;

		for (let clientWithID of this.clients) {
			if (clientWithID.readyState === ws.OPEN && clientWithID.id !== senderWsConnectionId) {
				const wsObject = {
					wsConnectionId: clientWithID.id ?? 'undefined',
					event: eventType,
					data
				};
				clientWithID.send(JSON.stringify(wsObject));
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
