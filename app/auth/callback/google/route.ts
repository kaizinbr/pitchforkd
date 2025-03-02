import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { fakerPT_BR } from "@faker-js/faker";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/set-profile";

    if (code) {
        const supabase = await createClient();
        const {
            data: { user },
            error,
        } = await supabase.auth.exchangeCodeForSession(code);

        const exists = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user!.id)
            .single();

        console.log(exists);

        if (!error && !exists.error) {
            const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === "development";
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}/home`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}/home`);
            } else {
                return NextResponse.redirect(`${origin}/home`);
            }
        }

        const animal = fakerPT_BR.animal.type();
        const tempUsername = fakerPT_BR.internet.username({
            firstName: user?.user_metadata.full_name?.substring(0, 10),
            lastName: animal,
        });
        const lowercased_username = tempUsername.toLowerCase();

        const { error: setProfileError } = await supabase
            .from("profiles")
            .insert({
                id: user!.id,
                username: tempUsername,
                lowercased_username,
                name: user?.user_metadata.full_name,
                avatar_url: user?.user_metadata.avatar_url,
                public: true,
            });

        console.log(setProfileError);

        if (!error) {
            const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === "development";
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
