require("dotenv").config();
import { Wss } from "./Wss";
import { TikTok } from "./TikTok";
import { Twitch } from "./Twitch";
import { YouTube } from "./YouTube";

export const wss = new Wss(8080);

/*
export const twitch = new Twitch(wss, process.env.twitch);
export const tiktok = new TikTok(wss, process.env.tiktok);
export const youtube = new YouTube(wss, process.env.youtube);*/

if (process.env.twitch) new Twitch(wss, process.env.twitch);
if (process.env.tiktok) new TikTok(wss, process.env.tiktok);
if (process.env.youtube) new YouTube(wss, process.env.youtube);
