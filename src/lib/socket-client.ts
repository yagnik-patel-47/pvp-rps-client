import { io } from "socket.io-client";
import { PUBLIC_SERVER_ENDPOINT } from '$env/static/public'

export const socket = io(PUBLIC_SERVER_ENDPOINT);
