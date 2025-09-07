import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import UserHeader from "@/components/user/Profile";
import UserTabs from "@/components/user/UserTabs";

type Props = {
    params: Promise<{ username: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
    const username = (await params).username;
    const supabase = await createClient();
    
    const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("lowercased_username", username.toLowerCase())
        .single();

    return {
        title: data?.username 
            ? `${data.username} | Pitchforkd`
            : "Usuário não encontrado | Pitchforkd",
    };
}

export default async function UserLayout({ params, children }: Props) {
    const username = (await params).username;
    const supabase = await createClient();

    // Buscar dados do usuário
    const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("lowercased_username", username.toLowerCase())
        .single();

    if (userError || !user) {
        notFound();
    }

    // Buscar usuário autenticado
    const { data: currentUser } = await supabase.auth.getUser();

    // Buscar quantidade de avaliações
    const { count: reviewCount } = await supabase
        .from("ratings")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true)
        .eq("user_id", user.id);

    // Buscar quantidade de seguidores
    const { count: followersCount } = await supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("followed_id", user.id);

    // Buscar quantidade de seguindo
    const { count: followingCount } = await supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("follower_id", user.id);

    const isOwnProfile = currentUser?.user?.id === user.id;

    return (
        <div className="flex flex-col items-center relative">
            {/* Header do perfil (Profile + FollowBtn + Favorites) */}
            <UserHeader 
                user={user} 
                isUser={isOwnProfile}
                reviewCount={reviewCount || 0}
                followersCount={followersCount || 0}
                followingCount={followingCount || 0}
            />
            
            {/* Tabs de navegação */}
            <UserTabs username={user.username} />
            
            {/* Conteúdo da página ativa */}
            <div className="w-full max-w-2xl">
                {children}
            </div>
        </div>
    );
}