import * as ws from 'ws';

export default class WebSocketManager {
    private static wss: ws.WebSocketServer | null = null;
    private static clients: ws.WebSocket[] = [];

    public static init(port: number): void {
        if (this.wss) {
            throw new Error("WebSocket server is already initialized.");
        }

        this.wss = new ws.WebSocketServer({ port, host: '0.0.0.0' });

        this.wss.on('connection', (clientWs: ws.WebSocket) => {
            this.clients.push(clientWs);

            clientWs.on('close', () => {
                const index = this.clients.indexOf(clientWs);
                if (index !== -1) {
                    this.clients.splice(index, 1);
                }
            });
        });
    }

    public static sendEvent(eventType: string, data: any): void {
        const jsonData = JSON.stringify({ event: eventType, data });

        for (let clientWs of this.clients) {
            if (clientWs.readyState === 1) { // Ensure WebSocket is open before sending
                clientWs.send(jsonData);
            }
        }
    }
}
