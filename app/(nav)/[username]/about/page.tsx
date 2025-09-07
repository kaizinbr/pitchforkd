import Favorites from "@/components/user/Favorites";
import { createClient } from "@/utils/supabase/server";

export default async function FavoritesPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;
    const supabase = await createClient();

    const { data: user } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("lowercased_username", username.toLowerCase())
        .single();

    if (!user) return null;

    

    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-center">
                {/* <Favorites /> */}
            </div>
        </div>
    );
}
