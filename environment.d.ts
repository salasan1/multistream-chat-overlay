declare global {
	namespace NodeJS {
		interface ProcessEnv {
			tiktok: string;
			twitch: string;
			youtube: string;
		}
	}
}

export {};
