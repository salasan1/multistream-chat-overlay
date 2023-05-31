import { Wss } from "./Wss";
import { ChatClient, ChatUser } from "@twurple/chat";
import { Functions } from "./Functions";
//import axios from "axios";
import { readFileSync } from "fs";

export class Twitch extends ChatClient {
	private wss: Wss;
	private badges: any;

	constructor(wss: Wss, username: string) {
		super({ channels: [username] });
		this.wss = wss;

		this.loadIcons();
		this.start(username);
	}
	private async start(channel: string) {
		await this.connect();
		console.log("Tw: Ready");
		this.wss.send(
			"twitch",
			Functions.EscapeXSS("Twitch"),
			Functions.EscapeXSS(`Connected to channel ${channel}`),
			{}
		);
		this.onMessageRemove(async (channel, messageId, msg) => {
			this.wss.deleteMsgs(msg.params.channel.toLowerCase());
		});

		this.onTimeout(async (channel, user, reason, duration) => {
			this.wss.deleteMsgs(user.toLowerCase());
		});

		this.onMessage(async (channel, user, text, tpm: any) => {
			// Ignore chat bots
			let ignorelist = ["streamelements", "nightbot", "fossabot", "moobot"];
			if (ignorelist.some((v) => user === v)) return;

			// Ignore commands
			if (text.startsWith("!")) return;

			// Badges & Color
			const other = {
				color: tpm.tags.get("color"),
				badges: await this.getBadgeIcons(tpm.tags.get("badges")),
			};

			// If there is no color, pick one
			if (!other.color) other.color = this.pickColor(user);

			// Badges
			//other.badges = await this.getBadgeIcons(tpm.tags.get("badges"));

			this.wss.send(
				"twitch",
				Functions.EscapeXSS(tpm.tags.get("display-name")),
				Functions.EscapeXSS(text),
				other
			);
		});
	}

	private pickColor(user: string) {
		// Colors are correct. Checked 20.1.2023
		// 2014 Jan https://discuss.dev.twitch.tv/t/default-user-color-in-chat/385
		// Twitch uses some randomizer so colors can't be the same for every client
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

		var color: string;

		var n = user.charCodeAt(0) + user.charCodeAt(user.length - 1);
		color = default_colors[n % default_colors.length][1];

		return color;
	}

	private async loadIcons() {
		if (this.badges) return this.badges;
		// TODO: Load badges from twitch api instead of file
		/*const data = await axios.get(
			"https://badges.twitch.tv/v1/badges/global/display"
		);*/

		this.badges = JSON.parse(readFileSync("./badges.json", "utf8"));
		console.log("Tw: Badges loaded from file (temporary fix)");
		return this.badges;
	}

	// Example badges 'moderator/1,founder/0,glhf-pledge/1',
	private async getBadgeIcons(badges: string) {
		// If no badges return
		if (!badges) return [];

		// Split badges
		let arr = badges.split(",");
		let data = await this.loadIcons();
		let badgearr = [];

		arr.forEach(async (e) => {
			// Split the badge name and version
			let res = e.split("/");

			try {
				badgearr.push(data.badge_sets[res[0]].versions[res[1]].image_url_4x);
			} catch (error) {
				console.log(`Tw: Some badge failed`, e);
				console.log(error);
			}
		});

		return badgearr;
	}
}
