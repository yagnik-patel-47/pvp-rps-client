// place files you want to import through the `$lib` alias in this folder.
export { socket } from "./socket-client";

export function getInitialsFromFullName(fullName: string | null | undefined) {
	if (fullName) {
		const nameParts = fullName.split(" ");
		const firstInitial = nameParts[0].charAt(0).toUpperCase();
		const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
		return `${firstInitial}${lastInitial}`;
	}
	return "P";
}

export interface GameState {
	id: string;
	players: Player[];
	state: "waiting" | "started";
	records?: RoundRecord[] | undefined;
	currentRound?:
		| {
				choices?:
					| {
							[key: string]: Choice;
					  }
					| undefined;
				winner?: string | undefined;
		  }
		| undefined;
}

interface RoundRecord {
	winner: string;
}

export interface Player {
	socketid: string;
	name: string;
	avatar: string;
	email: string;
}

export type Choice = "rock" | "paper" | "scissor";
