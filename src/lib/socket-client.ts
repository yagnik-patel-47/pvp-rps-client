import { io } from "socket.io-client";
import { PUBLIC_SERVER_ENDPOINT } from "$env/static/public";
import { dev } from "$app/environment";

export const socket = io(dev ? "http://localhost:3000" : PUBLIC_SERVER_ENDPOINT);
