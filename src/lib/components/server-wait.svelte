<script lang="ts">
	import Spinner from "$lib/assets/loading-spinner.svg";
</script>

<div
	class="h-dvh fixed w-full flex flex-col justify-center gap-2 items-center bg-black/30 backdrop-blur-md z-50 p-4"
>
	<p class="text-white text-xl text-center">Trying to connect with server. Please wait...</p>
	<p class="text-white text-center">Server might be cold starting, this may take a few seconds.</p>
	<img width={40} height={40} class="size-10 mt-4" src={Spinner} alt="Loading Spinner" />
</div>
