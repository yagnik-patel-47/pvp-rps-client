<script lang="ts">
	import Nav from "$lib/components/nav.svelte";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { socket, type GameState } from "$lib";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { gameState } from "$lib/store/game-state";
	let showInLobby = false;
	let joinCode = "";

	socket.on("roomNotFound", () => {
		alert("No room found with entered code.");
	});
	socket.on("roomIsFull", () => {
		alert("Room is already full.");
	});
	socket.on("roomIsStarted", () => {
		alert("Game is already started.");
	});
	socket.on("getRoomData", (data: GameState) => {
		gameState.set(data);
		goto("/lobby");
	});
</script>

<header>
	<Nav />
</header>
<main class="py-12 px-8 lg:px-60 w-full">
	<Tabs.Root value="join" class="w-full lg:w-[600px] mx-auto">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="join">Join Room</Tabs.Trigger>
			<Tabs.Trigger value="create">Create Room</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="join">
			<Card.Root>
				<Card.Header>
					<Card.Title>Join the already created room.</Card.Title>
					<Card.Description>Enter the code given by creator of the room.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<div class="space-y-1">
						<Label for="code">Room Code</Label>
						<Input bind:value={joinCode} id="code" placeholder="e.g. ZIaG9" />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button
						on:click={() => {
							if ($page.data.session) {
								socket.emit("initGame");
								gameState.set(null);
								socket.emit("joinGame", joinCode, {
									socketid: socket.id,
									email: $page.data.session.user?.email,
									name: $page.data.session.user?.name,
									avatar: $page.data.session.user?.image
								});
							}
						}}>Join</Button
					>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="create">
			<Card.Root>
				<Card.Header>
					<Card.Title>Create a new room.</Card.Title>
					<Card.Description
						>This will create a room with random ID. Share this ID with your friend or a random
						player will join from public rooms page.
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<div class="flex items-center space-x-2">
						<Checkbox id="showInLobby" bind:checked={showInLobby} aria-labelledby="show-in-lobby" />
						<Label
							id="show-label"
							for="showInLobby"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Show this room in public rooms page.
						</Label>
					</div>
				</Card.Content>
				<Card.Footer>
					<Button
						on:click={() => {
							if ($page.data.session) {
								socket.emit("initGame");
								gameState.set(null);
								socket.emit("createLobby", {
									socketid: socket.id,
									email: $page.data.session.user?.email,
									name: $page.data.session.user?.name,
									avatar: $page.data.session.user?.image
								});
							}
						}}>Create</Button
					>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</main>
