import { dev } from "$app/environment";
import { PUBLIC_SERVER_ENDPOINT } from "$env/static/public";

export const ws = new WebSocket(
	`ws://${dev ? "localhost:3000" : PUBLIC_SERVER_ENDPOINT}`,
);
