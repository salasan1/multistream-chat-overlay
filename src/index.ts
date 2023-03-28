require("dotenv").config();
import { Wss } from "./Wss";
import { TikTok } from "./TikTok";
import { Twitch } from "./Twitch";
import { YouTube } from "./YouTube";
import { writeFile } from "fs";

export const wss = new Wss(8080);

const tw = process.env.twitch;
const tt = process.env.tiktok;
const yt = process.env.youtube;

writeFile(".env", "TIKTOK=\nTWITCH=\nYOUTUBE=", { flag: "wx" }, function (err) {
	if (err) return;
	console.error(
		"Error: Seems that .env file is missing. Creating one...\n * Please configure it and start this again."
	);
	process.exit(0);
});

if (!tt && !tw && !yt) console.warn("Warning: .env file is misconfigured!");

if (tw) new Twitch(wss, tw);
if (tt) new TikTok(wss, tt);
if (yt) new YouTube(wss, yt);
