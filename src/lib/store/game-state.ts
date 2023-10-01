import type { GameState } from "$lib";
import { writable } from "svelte/store";

export const gameState = writable<GameState | null>(null);
