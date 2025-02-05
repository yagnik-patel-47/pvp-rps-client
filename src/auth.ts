import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import { sequence } from "@sveltejs/kit/hooks";

const { handle: auth } = SvelteKitAuth({
	providers: [Google],
	trustHost: true,
});

const handleCookie = async ({ event, resolve }) => {
	const session = await event.locals.getSession();
	if (session?.user?.email) {
		event.cookies.set("email", session.user.email, {
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});
	} else {
		event.cookies.delete("email", { path: "/" });
	}
	return resolve(event);
};

export const handle = sequence(auth, handleCookie);
