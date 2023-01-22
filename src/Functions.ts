export class Functions {
	static EscapeXSS(unsafe: string) {
		if (!unsafe) return;
		return unsafe
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");
	}

	static wait(milliseconds: number) {
		return new Promise((resolve) => setTimeout(resolve, milliseconds));
	}
}
