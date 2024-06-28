<script lang="ts">
	import Logo from "$lib/assets/logo.svg";
	import { Button } from "./ui/button";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";
	import { page } from "$app/stores";
	import { signIn, signOut } from "@auth/sveltekit/client";
	import * as Avatar from "$lib/components/ui/avatar";
	import { getInitialsFromFullName } from "$lib";
</script>

<nav class="px-8 lg:px-96 py-12 space-y-6">
	<div class="flex justify-between items-center">
		<img class="w-24 lg:w-32" src={Logo} alt="Logo" />
		<div class="flex gap-3 items-center">
			{#if !$page.data.session}
				<Button on:click={() => signIn("google")} class="px-8 max-lg:hidden">Login</Button>
			{/if}
			{#if $page.url.pathname === "/"}
				<a href="/rooms" class={`${buttonVariants({ variant: "link" })}`}>Public Rooms</a>
			{:else if $page.url.pathname === "/rooms"}
				<a href="/" class={`${buttonVariants({ variant: "link" })}`}>Back</a>
			{/if}
			{#if $page.data.session}
				<Popover.Root>
					<Popover.Trigger>
						<Avatar.Root>
							<Avatar.Image
								src={$page.data.session.user?.image}
								alt={$page.data.session.user?.name}
							/>
							<Avatar.Fallback
								>{getInitialsFromFullName($page.data.session.user?.name)}</Avatar.Fallback
							>
						</Avatar.Root>
					</Popover.Trigger>
					<Popover.Content class="space-y-3" align="end" sideOffset={10} alignOffset={10}>
						<p class="font-medium text-lg">{$page.data.session.user?.name}</p>
						<p class="font-medium">{$page.data.session.user?.email}</p>
						<Button variant="secondary" on:click={() => signOut()} class="w-full">Logout</Button>
					</Popover.Content>
				</Popover.Root>
			{/if}
		</div>
	</div>
	{#if !$page.data.session}
		<Button on:click={() => signIn("google")} class="w-full lg:hidden">Login</Button>
	{/if}
</nav>
