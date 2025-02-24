import { dev, browser } from "$app/environment";
import { PUBLIC_SERVER_ENDPOINT } from "$env/static/public";

export const ws = browser
	? new WebSocket(
			`${dev ? "ws" : "wss"}://${dev ? "localhost:3000" : PUBLIC_SERVER_ENDPOINT}`,
		)
	: null;
