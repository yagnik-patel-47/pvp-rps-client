// import type { WebSocketHandler } from "svelte-adapter-bun";
// import {
// 	createGameRoom,
// 	createLobby,
// 	destroyRoom,
// 	// exchangeData,
// 	playerJoin,
// 	saveAndBrodcastResult,
// 	// setGameState,
// } from "$lib/server/game";
// import { getPublicRooms } from "$lib/server/utils";

export { handle } from "./auth";

// export const handleWebsocket: WebSocketHandler<{ email: string }> = {
// 	open(ws) {
// 		const msg = `${ws.data.email} has entered the chat`;
// 		console.log(msg);
// 		// ws.subscribe("the-group-chat");
// 		// server.publish("the-group-chat", msg);
// 	},
// 	upgrade(request: Request, upgrade: Function) {
// 		const url = new URL(request.url);
// 		console.log(url);

// 		if (url.pathname.startsWith("/ws")) {
// 			console.log("kick");

// 			const cookies = request.headers.get("cookie");
// 			const { email } = getUserFromCookies(cookies);
// 			return upgrade(request, {
// 				data: { email },
// 				headers: {
// 					"Access-Control-Allow-Origin": "*",
// 					"Access-Control-Allow-Credentials": "true",
// 				},
// 			});
// 		}
// 	},
// 	message(ws, message) {
// 		const data = JSON.parse(message as string);

// 		switch (data.type) {
// 			case "create_room":
// 				createLobby(ws, data.player, data.public);
// 				break;

// 			case "join_room":
// 				playerJoin(ws, data.roomId, data.player);
// 				break;

// 			case "make_choice":
// 				saveAndBrodcastResult(ws, data.choice, data.game.id);
// 				break;

// 			case "lobby_to_game":
// 				createGameRoom(ws, data.game.id);
// 				break;

// 			case "announce_left":
// 				destroyRoom(ws, data.game.id);
// 				break;

// 			case "fetch_public_rooms":
// 				getPublicRooms(ws);
// 				break;

// 			default:
// 				break;
// 		}
// 	},
// 	// async close(ws) {
// 	//   const msg = `${ws.data.email} has left the chat`;
// 	//   console.log(msg);
// 	// },
// };

// function getUserFromCookies(cookies: string | null) {
// 	if (!cookies) {
// 		return { email: "anonymous@example.com" };
// 	}

// 	const cookieMap = new Map(
// 		cookies
// 			.split(";")
// 			.map((cookie) => cookie.trim().split("="))
// 			.filter((parts) => parts.length === 2) as [string, string][],
// 	);

// 	const mail = decodeURIComponent(cookieMap.get("email") || "");

// 	return {
// 		email: mail,
// 	};
// }
