<script lang="ts">
	import { socket, type GameState } from "$lib";
	import Nav from "$lib/components/nav.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { gameState } from "$lib/store/game-state";
	import { goto } from "$app/navigation";

	let rooms: { id: string; status: string }[] = [],
		showData = false;

	socket.on("sendRooms", (roomsData: { id: string; status: string }[]) => {
		rooms = roomsData;
		showData = true;
	});

	socket.on("getRoomData", (data: GameState) => {
		gameState.set(data);
		goto("/lobby");
	});

	socket.on("roomIsFull", () => {
		alert("Room is already full.");
	});

	socket.on("roomIsStarted", () => {
		alert("Game is already started.");
	});

	onMount(() => {
		socket.emit("getRooms");
	});
</script>

<header>
	<Nav />
</header>
<main class="py-12 px-8 lg:px-96 w-full overflow-y-auto">
	<h1 class="text-3xl font-semibold">Public rooms</h1>
	{#if showData}
		{#if rooms.length === 0}
			<h2 class="text-2xl mt-4">No rooms to show right now.</h2>
		{/if}
		{#each rooms as room}
			<div
				class="bg-neutral-800 text-lg flex justify-around w-full p-4 mt-10 rounded-md items-center"
			>
				<span>Room ID: {room.id}</span>
				<span>Status: {room.status}</span>
				<Button
					on:click={() => {
						if ($page.data.session) {
							socket.emit("initGame");
							gameState.set(null);
							socket.emit("joinGame", room.id, {
								socketid: socket.id,
								email: $page.data.session.user?.email,
								name: $page.data.session.user?.name,
								avatar: $page.data.session.user?.image
							});
						}
					}}
					disabled={room.status === "started"}>Join</Button
				>
			</div>
		{/each}
	{:else}
		<Skeleton class="h-16 w-full mt-10" />
		<Skeleton class="h-16 w-full mt-10" />
		<Skeleton class="h-16 w-full mt-10" />
		<Skeleton class="h-16 w-full mt-10" />
	{/if}
</main>
