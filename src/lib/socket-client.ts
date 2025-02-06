import { dev } from "$app/environment";
import { PUBLIC_SERVER_ENDPOINT } from "$env/static/public";
import { browser } from "$app/environment";

export const ws = browser
	? new WebSocket(
			`${dev ? "ws" : "wss"}://${dev ? "localhost:3000" : PUBLIC_SERVER_ENDPOINT}`,
		)
	: null;
