require("dotenv").config();
import { Wss } from "./Wss";
import { TikTok } from "./TikTok";
import { Twitch } from "./Twitch";

export const wss = new Wss(8080);

export const twitch = new Twitch(wss, process.env.twitch);
export const tiktok = new TikTok(wss, process.env.tiktok);
