import { WebSocketServer } from "ws";

export class Wss extends WebSocketServer {
	constructor(port: number) {
		super({ port: port });

		console.log(`WSS: Running on port ${port}`);

		this.start();
	}

	private start() {
		this.on("connection", (ws) => {
			console.log(`WSS: ${this.clients.size} clients`);

			ws.on("message", (data) => {
				console.log(`WSS: Client has sent us: ${data}`);
			});

			ws.on("close", () => {
				console.log(`WSS: ${this.clients.size} clients`);
			});

			ws.onerror = function () {
				console.log("WSS: Some Error occurred");
			};
		});
	}

	send(platform: string, user: string, message: string, other: object) {
		// If there are no clients connected, don't send anything
		if (!this.clients || this.clients.size === 0) return;

		/**
		 * All inputs should be XSS escaped before sending it here
		 */
		this.clients.forEach((client) => {
			client.send(
				JSON.stringify({
					platform: platform,
					user: user,
					message: message,
					other: other,
				})
			);
		});
	}
}
