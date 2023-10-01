<script>
	import "@fontsource/barlow-semi-condensed/300.css";
	import "@fontsource/barlow-semi-condensed/400.css";
	import "@fontsource/barlow-semi-condensed/500.css";
	import "@fontsource/barlow-semi-condensed/600.css";
	import "@fontsource/barlow-semi-condensed/700.css";
	import "@fontsource/barlow-semi-condensed/800.css";
	import "../app.postcss";
	import { gsap } from "gsap/dist/gsap";
	import { Flip } from "gsap/dist/Flip";

	gsap.registerPlugin(Flip);
</script>

<slot />

<style>
	:global(body) {
		font-family: "Barlow Semi Condensed", sans-serif;
	}
</style>
