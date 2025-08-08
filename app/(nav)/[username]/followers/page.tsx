import FollowersList from "@/components/user/FollowersList";
import { createClient } from "@/utils/supabase/server";

export default async function FollowersPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;
    const supabase = await createClient();

    const { data: user } = await supabase
        .from("profiles")
        .select("id")
        .eq("lowercased_username", username.toLowerCase())
        .single();

    if (!user) return null;

    // Buscar seguidores do usuário
    const { data: followers, error } = await supabase
        .from("follows")
        .select(
            `*
        `
        )
        .eq("followed_id", user.id)
        .range(0, 29);

    if (error) {
        console.error(error);
        return;
    }

    if (!followers) {
        console.error("Error fetching followers");
        return null;
    }

    const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, username, avatar_url, verified")
        .order("created_at", { ascending: false })
        .in(
            "id",
            followers.map((f) => f.follower_id)
        );

    if (profileError) {
        console.error("Error fetching profiles:", profileError);
        return null;
    }
    // console.log("Profiles data:", profiles);

    return (
        <div className="w-full">
            {profiles && profiles.length > 0 ? (
                <FollowersList initialFollowers={profiles} />
            ) : (
                <div className="w-full flex items-center justify-center">
                    <p className="text-neutral-500">Nenhum seguidor encontrado.</p>
                </div>
            )}
        </div>
    );
}
