import { appInfo, backendLogs, config, liveData, wsConnectionId } from '$lib/store';
import { get } from 'svelte/store';
import { newErrorToast, newInfoToast } from '../Utilities/UtilStoreToast';
import type LiveData from '../models/LiveData';

export default class {
	private static RETRY_DELAY = 1000; // Start with 1 second
	private static MAX_RETRY_RELAY = 60000; // Maximum delay is 1 minute

	private static socket: WebSocket | null = null;

	public static initSocket(): void {
		if (this.socket) {
			const errMsg = `Socket already initialized!`;
			newErrorToast(errMsg);
		} else {
			this.socket = new WebSocket(`ws://${window.location.hostname}:${get(appInfo).webSocketPort}`);
		}

		this.socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message);
			if (message.wsConnectionId && message.wsConnectionId.length > 0) {
				wsConnectionId.set(message.wsConnectionId);
			}
			const eventName = message.event.toUpperCase();
			switch (message.event) {
				case 'enabledStateUpdate':
					newInfoToast('Received ' + eventName);
					config.set({
						...get(config),
						Enabled: message.data.state as boolean
					});
					break;
				case 'enabledPowergridStateUpdate':
					newInfoToast('Received ' + eventName);
					config.set({
						...get(config),
						UsePowergrid: message.data.state as boolean
					});
					break;
				case 'preferredPhaseUpdate':
					newInfoToast('Received ' + eventName.t);
					config.set({
						...get(config),
						PreferredPhase: (message.data.state as 0 | 1 | 2) ?? 0
					});
					break;
				case 'liveDataUpdate':
					newInfoToast('Received ' + eventName);
					liveData.set(message.data as LiveData);
					break;
				case 'backendTerminalUpdate':
					const type = message.data.type as string;
					const msg = message.data.msg as string;
					const ts = message.data.ts as string;
					backendLogs.update((currentLogs) => {
						const updatedLogs = [...currentLogs.items, { type, msg, ts }];
						if (updatedLogs.length > 200) {
							updatedLogs.splice(0, updatedLogs.length - 200);
						}
						return {
							items: updatedLogs
						};
					});

					break;
			}
		};

		this.socket.onopen = () => {
			console.log('WebSocket connection established');
			this.RETRY_DELAY = 1000; // Reset retry delay on successful connection
		};

		this.socket.onclose = (event) => {
			if (event.wasClean) {
				console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.log('Connection died');
				this.socket = null;
				// Exponential backoff for reconnection
				setTimeout(() => this.initSocket(), this.RETRY_DELAY);
				this.RETRY_DELAY = Math.min(this.RETRY_DELAY * 2, this.MAX_RETRY_RELAY);
			}
		};

		this.socket.onerror = (error) => {
			console.error(`[WebSocket Error] ${error}`);
			newErrorToast(`Websocket Error: ${error.type}`);
		};
	}
}
