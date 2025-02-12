<script lang="ts">
	import { ws } from "$lib";
	import Nav from "$lib/components/nav.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { page } from "$app/stores";
	import { gameState } from "$lib/store/game-state";
	import { goto } from "$app/navigation";
	import ServerWait from "$lib/components/server-wait.svelte";

	let rooms: { id: string; state: string }[] = [],
		showData = false;
	let connectionLoading = false;

	$: {
		if (ws?.readyState === WebSocket.CONNECTING) {
			connectionLoading = true;
		} else {
			connectionLoading = false;
		}

		if (ws) {
			ws.onopen = () => {
				ws?.send(JSON.stringify({ type: "store_email", email: $page.data.session?.user?.email }));
				ws?.send(JSON.stringify({ type: "fetch_public_rooms" }));
				connectionLoading = false;
			};

			if (ws?.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({ type: "fetch_public_rooms" }));
			} else if (ws?.readyState === WebSocket.CLOSED) {
				alert("Connection is closed. Please refresh the page.");
			}

			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.type === "get_public_rooms") {
					rooms = data.rooms;
					showData = true;
				}
				if (data.type === "room_not_found") {
					alert("No room found with entered code.");
				}
				if (data.type === "room_is_full") {
					alert("Room is already full.");
				}
				if (data.type === "room_is_started") {
					alert("Game is already started.");
				}
				if (data.type === "get_room_data") {
					gameState.set(data.data);
					goto("/lobby");
				}
			};
		}
	}
</script>

{#if connectionLoading}
	<ServerWait />
{/if}
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
				<span>Status: {room.state}</span>
				<Button
					on:click={() => {
						if ($page.data.session) {
							gameState.set(null);
							ws?.send(
								JSON.stringify({
									type: "join_room",
									roomId: room.id,
									player: {
										email: $page.data.session.user?.email,
										name: $page.data.session.user?.name,
										avatar: $page.data.session.user?.image
									}
								})
							);
						}
					}}
					disabled={room.state === "started"}>Join</Button
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
