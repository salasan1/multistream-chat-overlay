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

			// Ignore chat bot
			if (user === "streamelements") return;

			// Jos väriä ei ole, arvotaan sellainen
			if (!other.color) other.color = this.color(user);

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

	private color(user: string) {
		// Värit ovat oikein. Tarkistettu 20.1.2023
		// Koodi 2014 tammikuu https://discuss.dev.twitch.tv/t/default-user-color-in-chat/385
		let default_colors = [
			["Red", "#FF0000"],
			["Blue", "#0000FF"],
			["Green", "#008000"],
			["FireBrick", "#B22222"],
			["Coral", "#FF7F50"],
			["YellowGreen", "#9ACD32"],
			["OrangeRed", "#FF4500"],
			["SeaGreen", "#2E8B57"],
			["GoldenRod", "#DAA520"],
			["Chocolate", "#D2691E"],
			["CadetBlue", "#5F9EA0"],
			["DodgerBlue", "#1E90FF"],
			["HotPink", "#FF69B4"],
			["BlueViolet", "#8A2BE2"],
			["SpringGreen", "#00FF7F"],
		];

		var color;

		var n = user.charCodeAt(0) + user.charCodeAt(user.length - 1);
		color = default_colors[n % default_colors.length][1];

		return color;
	}
}
