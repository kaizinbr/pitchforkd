"use client";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
    const supabase = createClient();

    const signInWithSpotify = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "spotify",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`, // URL de retorno
                scopes: "user-read-email user-top-read", // Escopos de permissão
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold">Login com Spotify</h1>
            <button
                onClick={signInWithSpotify}
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg"
            >
                Entrar com Spotify
            </button>
        </div>
    );
}
