import { WebcastPushConnection } from "tiktok-live-connector";
import { Functions } from "./Functions";
import { Wss } from "./Wss";

export class TikTok extends WebcastPushConnection {
	wss: Wss;
	constructor(wss: Wss, username: string) {
		super(username);
		this.wss = wss;

		this.start();
	}

	private async start() {
		const con = this.connect()
			.then((state) => {
				console.info(`TT: Connected to roomId ${state.roomId}`);
				this.wss.send(
					"tiktok",
					Functions.EscapeXSS("TikTok"),
					Functions.EscapeXSS(`Connected to roomId ${state.roomId}`),
					{ color: "green" }
				);

				this.on("chat", (data: TikTokChat) => {
					if (!data.comment) return;
					const other = { badges: [] };

					// BADGE
					// TT: Something missing from badge{"badgeSceneType":2,"type":"pm_mt_live_ng_im","name":"New gifter"}
					if (data.userBadges.length > 0) {
						data.userBadges.forEach((e) => {
							if (e.type === "pm_mt_moderator_im")
								return other.badges.push("imgs/tiktokmod.png");
							if (e.type === "image") return other.badges.push(e.url + "#");

							console.log(
								"TT: Something missing from badge" + JSON.stringify(e)
							);
						});
					}
					// data.uniqueId
					this.wss.send(
						"tiktok",
						Functions.EscapeXSS(data.nickname),
						Functions.EscapeXSS(data.comment),
						other
					);
				});

				this.on("streamEnd", async (data) => {
					console.log("TT: Stream ended. Trying to reconnect in 30s");
					await Functions.wait(30000);
					await this.start();
				});
			})
			.catch(async (e) => {
				console.log(e);

				console.log("TT: Trying to reconnect in 30s");
				await Functions.wait(30000);
				await this.start();
			});
	}
}

// Generated with http://json2ts.com/
export interface UserBadge {
	type: string;
	name: string;
	displayType?: number;
	url: string;
}

export interface UserDetails {
	createTime: string;
	bioDescription: string;
	profilePictureUrls: string[];
}

export interface FollowInfo {
	followingCount: number;
	followerCount: number;
	followStatus: number;
	pushStatus: number;
}

export interface TikTokChat {
	comment: string;
	userId: string;
	secUid: string;
	uniqueId: string;
	nickname: string;
	profilePictureUrl: string;
	rollowRole: number;
	userBadges: UserBadge[];
	userDetails: UserDetails;
	followInfo: FollowInfo;
	isModerator: boolean;
	isNewGifter: boolean;
	isSubscriber: boolean;
	topGifterRank?: any;
	msgId: string;
	createTime: string;
}
