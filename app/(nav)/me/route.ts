import { createClient } from "@/utils/supabase/server";
import { auth } from "@/auth";

export async function GET(): Promise<Response> {
    const supabase = createClient();
    const session = await auth();

    if (!session?.user) {
        return new Response(null, {
            status: 307, // Use 308 for a permanent redirect, 307 for a temporary redirect
            headers: {
                Location: `/login`,
                "Cache-Control": "no-store, max-age=0",
            },
        });
    }

    const { data, error } = await (await supabase).auth.getUser();

    if (error) {
        return new Response(null, {
            status: 307, // Use 308 for a permanent redirect, 307 for a temporary redirect
            headers: {
                Location: `/login`,
                "Cache-Control": "no-store, max-age=0",
            },
        });
    }

    if (!data) {
        return new Response(null, {
            status: 307, // Use 308 for a permanent redirect, 307 for a temporary redirect
            headers: {
                Location: `/login`,
                "Cache-Control": "no-store, max-age=0",
            },
        });
    }

    const user = data.user;

    const { data: profile, error: profileError } = await (await supabase)
        .from("profiles")
        .select("name, username, avatar_url")
        .eq("id", user.id)
        .single();

    if (profileError) {
        return new Response(null, {
            status: 307, // Use 308 for a permanent redirect, 307 for a temporary redirect
            headers: {
                Location: `/sign-in`,
                "Cache-Control": "no-store, max-age=0",
            },
        });
    }

    if (!profile) {
        return new Response(null, {
            status: 307, // Use 308 for a permanent redirect, 307 for a temporary redirect
            headers: {
                Location: `/sign-in`,
                "Cache-Control": "no-store, max-age=0",
            },
        });
    }

    return new Response(null, {
        status: 308, // Use 308 for a permanent redirect, 307 for a temporary redirect
        headers: {
            Location: `/${profile.username}`,
            "Cache-Control": "no-store, max-age=0",
        },
    });
}
