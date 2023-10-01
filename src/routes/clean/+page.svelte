<script>
	import { socket } from "$lib";
	import { onMount } from "svelte";

	onMount(() => {
		socket.emit("cleanRooms");
	});
</script>

<h1 class="text-4xl text-center mt-20">Cleaning Rooms...</h1>
