import { Wss } from "./Wss";
import { TikTok } from "./TikTok";
import { Twitch } from "./Twitch";

export const wss = new Wss(8080);

new TikTok(wss, "ossiteks");
new Twitch(wss, "ossitek");
