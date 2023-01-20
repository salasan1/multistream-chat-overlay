declare global {
	namespace NodeJS {
		interface ProcessEnv {
			tiktok: string;
			twitch: string;
		}
	}
}

export {};
