import { createClient } from "@/utils/supabase/server";
import { identity } from "@mantine/core/lib/core/factory/factory";
import { NextResponse } from "next/server";
import { generateFromEmail, generateUsername } from "unique-username-generator";

export async function GET(request: Request) {
    // The `/auth/callback` route is required for the server-side auth flow implemented
    // by the SSR package. It exchanges an auth code for the user's session.
    // https://supabase.com/docs/guides/auth/server-side/nextjs

    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

    console.log("code", code);
    console.log("redirect_to", redirectTo);

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
        const {
            data: { user },
        } = await supabase.auth.getUser();
        console.log("user", user);
    }

    if (redirectTo) {
        return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${origin}/protected/reset-password`);
}
