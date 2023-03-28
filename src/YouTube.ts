import { LiveChat } from "youtube-chat";
import { Functions } from "./Functions";
import { Wss } from "./Wss";

export class YouTube extends LiveChat {
	wss: Wss;

	constructor(wss: Wss, handle: string) {
		super({ handle: handle });
		this.wss = wss;
		this.startt(handle);
	}

	private async startt(handle: string) {
		this.start()
			.then(() => {
				this.wss.send(
					"youtube",
					Functions.EscapeXSS("YouTube"),
					Functions.EscapeXSS(`Connected ${handle}`),
					{ color: "green" }
				);
				console.log("YT: Ready");

				this.on("chat", (chatItem) => {
					var msg = "";
					chatItem.message.forEach((e: any) => {
						if (e.emojiText) msg += e.emojiText;
						else if (e.text) msg += e.text;
						else console.log("YT: Something is missing", e);
					});

					let other = {
						color: undefined,
						badges: [],
					};

					if (chatItem.isModerator) {
						other.badges = ["imgs/ytmod.png"];
						other.color = "#5E84F1";
					}

					this.wss.send(
						"youtube",
						Functions.EscapeXSS(chatItem.author.name),
						Functions.EscapeXSS(msg),
						other
					);
				});

				this.on("error", (err) => {
					console.log("YT: Error occurred", err);
				});

				this.on("end", (reason) => {
					console.log(`YT: Stream ended. So is loop ${reason}`);
					this.stop();
				});
			})
			.catch(async (e) => {
				this.stop();
				console.log("YT: Trying to reconnect in 30s", e);
				await Functions.wait(30000);
				await this.startt(handle);
			});
	}
}
