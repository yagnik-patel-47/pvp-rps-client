<script lang="ts">
	import Logo from "$lib/assets/logo.svg";
	import PaperIcon from "$lib/assets/icon-paper.svg";
	import ScissorIcon from "$lib/assets/icon-scissors.svg";
	import RockIcon from "$lib/assets/icon-rock.svg";
	import GridBg from "$lib/assets/bg-triangle.svg";
	import { onDestroy, tick } from "svelte";
	import { Flip } from "gsap/dist/Flip";
	import { socket, type GameState } from "$lib";
	import { gameState } from "$lib/store/game-state";
	import { Terminal } from "lucide-svelte";
	import * as Alert from "$lib/components/ui/alert";
	import { Button } from "$lib/components/ui/button";

	const choiceLib = {
		rock: {
			image: RockIcon,
			flip_id: "rock-btn",
			label: "Rock Button",
			color: "hsl(349,71%,52%)"
		},
		paper: {
			image: PaperIcon,
			flip_id: "paper-btn",
			label: "Paper Button",
			color: "hsl(230,89%,62%)"
		},
		scissor: {
			image: ScissorIcon,
			flip_id: "scissor-btn",
			label: "Scissor Button",
			color: "hsl(39,89%,49%)"
		}
	};
	let opponentChoiceImage: HTMLImageElement;
	let opponentChoiceButton: HTMLElement;
	let loadingPreviewImage: HTMLImageElement;
	let loadingPreviewButton: HTMLElement;
	let showAlert = false;
	let score = 0;
	let opponentId: string;
	let choicePicked: "paper" | "rock" | "scissor" | null = "paper";
	let loading = false;
	let showPicked = false;
	let showResult = false;
	let timer = 10;

	const reduceTime = () => {
		if (timer === 0) {
			return;
		}
		timer--;
		return setTimeout(() => reduceTime(), 1000);
	};

	const fanimate = async (targets: string) => {
		const state = Flip.getState(targets);
		showPicked = !showPicked;
		await tick();
		Flip.from(state, {
			targets: targets,
			duration: 0.2,
			ease: "power1.inOut",
			scale: true
		});
	};

	let imageIndex = 0;
	const imageAnimate = () => {
		if (!!loadingPreviewImage && !!loadingPreviewButton) {
			loadingPreviewImage.src = [RockIcon, PaperIcon, ScissorIcon][imageIndex];
			loadingPreviewButton.style.borderColor = [
				"hsl(349,71%,52%)",
				"hsl(230,89%,62%)",
				"hsl(39,89%,49%)"
			][imageIndex];
			imageIndex === 2 ? (imageIndex = 0) : (imageIndex += 1);
		}
	};

	let intervalID: number;

	onDestroy(() => {
		clearInterval(intervalID);
		socket.emit("announceLeave", $gameState?.id);
		gameState.set(null);
	});

	socket.on("selectChoice", () => {
		loading = false;
		showResult = false;
		showPicked = false;
		if ($gameState)
			gameState.set({
				...$gameState,
				currentRound: undefined
			});
	});

	$: if (showResult && opponentChoiceImage && opponentChoiceButton && opponentId) {
		opponentChoiceImage.src = choiceLib[$gameState!.currentRound!.choices![opponentId]].image;
		opponentChoiceButton.style.borderColor =
			choiceLib[$gameState!.currentRound!.choices![opponentId]].color;
	}

	socket.on("announceWinner", (state: GameState) => {
		if (state.currentRound?.winner === socket.id) {
			score++;
		}
		gameState.set(state);
		$gameState?.players.forEach((player) => {
			if (player.socketid !== socket.id) opponentId = player.socketid;
		});
		showResult = true;
		clearInterval(intervalID);
	});

	socket.on("oppLeftGame", () => {
		showAlert = true;
	});
</script>

<header
	class="w-full max-w-3xl mx-auto mt-4 lg:mt-12 flex justify-between items-center border-[hsl(217,16%,45%)] border-[3px] p-6 rounded-xl"
>
	<img class="w-24 lg:w-40" src={Logo} alt="Logo" />
	<div class="bg-neutral-100 py-2 px-6 flex flex-col items-center rounded-lg">
		<span class="block text-[hsl(229,64%,46%)] font-semibold">SCORE</span>
		<span class="block text-neutral-700 font-bold text-5xl">{score}</span>
	</div>
</header>
{#if showAlert}
	<div class="fixed top-10 w-full flex justify-center px-4">
		<Alert.Root class="w-full max-w-xl animate-in slide-in-from-top">
			<Terminal class="h-4 w-4" />
			<Alert.Title>Opponent left game!</Alert.Title>
			<Alert.Description>So I guess you won this time :))</Alert.Description>
			<Button href="/" class="float-right" data-sveltekit-replacestate>Go Home</Button>
		</Alert.Root>
	</div>
{/if}
<main class="lg:mt-20 mt-10">
	{#if loading}
		<p class="text-center text-5xl font-semibold">Loading...</p>
	{:else}
		{#if !showPicked}
			<p class="text-center text-3xl font-semibold mt-12">Select a choice. (in {timer}s)</p>
			<div
				class="relative mt-12 grid grid-cols-2 lg:gap-y-16 justify-items-center grid-rows-2 mx-auto w-full max-w-2xl px-8 gap-x-4"
			>
				<img
					class="absolute inset-0 w-full h-full scale-[0.6] z-[-1] pointer-events-none"
					src={GridBg}
					alt="Triangle Background"
				/>
				<button
					aria-label="Paper Button"
					class="bg-white p-4 lg:p-8 aspect-square flex justify-center items-center rounded-full border-[hsl(230,89%,62%)] border-[16px] lg:border-[20px] w-fit paper-btn"
					on:click={() => {
						fanimate(".paper-btn");
						choicePicked = "paper";
						intervalID = setInterval(imageAnimate, 300);
						socket.emit("choiceSelected", "paper");
					}}
					data-flip-id="paper-btn"
				>
					<img
						class="w-16 h-16 lg:w-20 lg:h-20 object-contain pointer-events-none"
						src={PaperIcon}
						alt="Paper Icon"
					/>
				</button>
				<button
					aria-label="Scissor Button"
					class="bg-white p-4 lg:p-8 aspect-square flex justify-center items-center rounded-full border-[hsl(39,89%,49%)] border-[16px] lg:border-[20px] w-fit scissor-btn"
					on:click={() => {
						fanimate(".scissor-btn");
						choicePicked = "scissor";
						intervalID = setInterval(imageAnimate, 300);
						socket.emit("choiceSelected", "scissor");
					}}
					data-flip-id="scissor-btn"
				>
					<img
						class="w-16 h-16 lg:w-20 lg:h-20 object-contain pointer-events-none"
						src={ScissorIcon}
						alt="Scissor Icon"
					/>
				</button>
				<button
					aria-label="Rock Button"
					class="bg-white h-full aspect-square w-auto col-span-2 p-4 lg:p-8 rounded-full border-[hsl(349,71%,52%)] border-[16px] lg:border-[20px] flex justify-center items-center rock-btn"
					on:click={() => {
						fanimate(".rock-btn");
						choicePicked = "rock";
						intervalID = setInterval(imageAnimate, 300);
						socket.emit("choiceSelected", "rock");
					}}
					data-flip-id="rock-btn"
				>
					<img
						class="w-14 h-14 lg:w-16 lg:h-16 object-contain pointer-events-none"
						src={RockIcon}
						alt="Rock Icon"
					/>
				</button>
			</div>
		{/if}
		{#if showPicked && choicePicked}
			<section
				class="px-8 md:px-20 xl:px-60 flex gap-y-8 flex-col lg:flex-row items-center justify-around lg:mt-40"
			>
				<div class="lg:space-y-12 space-y-3 flex flex-col items-center">
					<span class="block text-3xl text-center font-semibold">YOU PICKED</span>
					<button
						aria-label={choiceLib[choicePicked].label}
						class={`bg-white p-8 md:p-12 lg:p-16 rounded-full ${
							choiceLib[choicePicked].label === "Paper Button"
								? "border-[hsl(230,89%,62%)]"
								: choiceLib[choicePicked].label === "Rock Button"
								? "border-[hsl(349,71%,52%)]"
								: "border-[hsl(39,89%,49%)]"
						} border-[16px] md:border-[25px] xl:border-[30px] w-fit rock-btn scissor-btn paper-btn`}
						data-flip-id={choiceLib[choicePicked].flip_id}
					>
						<img
							class="w-16 h-16 lg:w-32 lg:h-32 object-contain pointer-events-none"
							src={choiceLib[choicePicked].image}
							alt={choiceLib[choicePicked].label}
						/>
					</button>
				</div>
				{#if showResult}
					<div class="space-y-5">
						<p class="text-2xl md:text-4xl lg:text-6xl font-semibold text-center">
							{$gameState?.currentRound?.winner === "tie"
								? "TIE!"
								: $gameState?.currentRound?.winner === socket.id
								? "YOU WIN!"
								: "YOU LOSE!"}
						</p>
						<p class="text-xl xl:text-3xl font-semibold">Next Round Starting In 3s...</p>
					</div>
				{/if}
				{#if showResult}
					<div class="lg:space-y-12 space-y-3 flex flex-col items-center">
						<span class="block text-3xl text-center font-semibold">OPPONENT PICKED</span>
						<button
							aria-label="Choice Button"
							class="bg-white p-8 md:p-12 lg:p-16 rounded-full border-[hsl(349,71%,52%)] border-[16px] md:border-[25px] xl:border-[30px] w-fit"
							id="opp-button"
							bind:this={opponentChoiceButton}
						>
							<img
								class="w-16 h-16 lg:w-32 lg:h-32 object-contain pointer-events-none"
								src={RockIcon}
								alt="Choice Icon"
								id="opp-selection"
								bind:this={opponentChoiceImage}
							/>
						</button>
					</div>
				{:else}
					<div class="lg:space-y-12 space-y-3 flex flex-col items-center">
						<span class="block text-3xl text-center font-semibold">OPPONENT PICKING...</span>
						<button
							aria-label="Choice Button"
							class="bg-white p-8 md:p-12 lg:p-16 rounded-full border-[hsl(349,71%,52%)] border-[16px] md:border-[25px] xl:border-[30px] w-fit"
							id="loading-preview-button"
							bind:this={loadingPreviewButton}
						>
							<img
								class="w-16 h-16 lg:w-32 lg:h-32 object-contain pointer-events-none"
								src={RockIcon}
								alt="Choice Icon"
								id="loading-preview-selection"
								bind:this={loadingPreviewImage}
							/>
						</button>
					</div>
				{/if}
			</section>
		{/if}
	{/if}
</main>
