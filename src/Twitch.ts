import { Wss } from "./Wss";
import { ChatClient, ChatUser } from "@twurple/chat";
import { Functions } from "./Functions";

export class Twitch extends ChatClient {
	wss: Wss;
	constructor(wss: Wss, username: string) {
		super({ channels: [username] });
		this.wss = wss;

		this.start();
	}
	private async start() {
		await this.connect();
		this.onConnect(() => {
			console.log("Twitch: Ready");
			this.wss.send(
				"twitch",
				Functions.EscapeXSS("Twitch"),
				Functions.EscapeXSS(`connected to channel`),
				{}
			);
		});

		this.onMessage((channel, user, text, tpm: any) => {
			const other: any = {
				color: tpm.tags.get("color"),
			};

			// Mod badge
			if (tpm.tags.get("mod") == 1) {
				other.badges = ["./imgs/twitchmod.png"];
			}

			this.wss.send(
				"twitch",
				Functions.EscapeXSS(tpm.tags.get("display-name")),
				Functions.EscapeXSS(text),
				other
			);
		});
	}
}
