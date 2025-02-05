<script lang="ts">
	import Nav from "$lib/components/nav.svelte";
	import { page } from "$app/stores";
	import * as Avatar from "$lib/components/ui/avatar";
	import { getInitialsFromFullName, ws, type Player } from "$lib";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { gameState } from "$lib/store/game-state";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	let opponent: Player | null = null;

	onMount(() => {
		if (ws) {
			ws.onmessage = (event: MessageEvent) => {
				const data = JSON.parse(event.data);
				if (data.type === "prepare_round_one") {
					const opponentFound = data.game.players.find(
						(player: Player) => player.email !== $page.data.session?.user?.email
					);
					if (opponentFound) {
						opponent = opponentFound;
					}
					setTimeout(() => {
						goto("/game", { replaceState: true });
						ws.send(JSON.stringify({ type: "lobby_to_game", game: { id: $gameState?.id } }));
					}, 2000);
					// goto("/game", { replaceState: true });
					// ws.send(JSON.stringify({ type: "lobby_to_game", game: { id: $gameState?.id } }));
				}
			};
		}
	});
</script>

<main>
	<Nav />
	<section class="lg:py-20 py-8 space-y-8 px-8 lg:px-20">
		{#if !opponent}
			<h1 class="text-2xl lg:text-3xl font-medium text-center">
				Waiting for another player to join...
			</h1>
		{/if}
		<span class="block px-10 py-4 rounded-lg bg-neutral-800 w-fit mx-auto text-lg font-medium"
			>Room code: <span class="tracking-wide">{$gameState?.id}</span></span
		>
		<div class="flex gap-6 flex-col lg:flex-row justify-evenly lg:!mt-40 items-center">
			{#if $page.data.session}
				<div class="flex gap-6 items-center">
					<Avatar.Root class="w-16 h-16 lg:w-24 lg:h-24">
						<Avatar.Image
							src={$page.data.session.user?.image}
							alt={$page.data.session.user?.name}
						/>
						<Avatar.Fallback
							>{getInitialsFromFullName($page.data.session.user?.name)}</Avatar.Fallback
						>
					</Avatar.Root>
					<span class="block text-3xl font-bold">{$page.data.session.user?.name}</span>
				</div>
			{/if}
			<span class="block text-4xl font-bold">VS</span>
			{#if opponent}
				<div class="flex gap-6 items-center">
					<Avatar.Root class="w-16 h-16 lg:w-24 lg:h-24">
						<Avatar.Image src={opponent.avatar} alt={opponent.name} />
						<Avatar.Fallback>{getInitialsFromFullName(opponent.name)}</Avatar.Fallback>
					</Avatar.Root>
					<span class="block text-3xl font-bold">{opponent.name}</span>
				</div>
			{:else}
				<div class="flex gap-6 items-center">
					<Skeleton class="w-16 h-16 lg:w-24 lg:h-24 rounded-full" />
					<Skeleton class="w-48 lg:w-60 h-10 rounded" />
				</div>
			{/if}
		</div>
		{#if opponent}
			<p class="text-2xl text-center">Game will start very soon.</p>
		{/if}
	</section>
</main>
