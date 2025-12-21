import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import UserHeader from "@/components/user/Profile";
import UserTabs from "@/components/user/UserTabs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Props = {
    params: Promise<{ username: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
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

    // Buscar dados do usuário
    const profile = await prisma.profile.findFirst({
        where: { lowercased_username: username.toLowerCase() },
    });

    if (!profile) {
        notFound();
    }

    // Buscar usuário autenticado
    const currentUser = await auth();

    // Buscar quantidade de avaliações
    const reviewCount = await prisma.rating.count({
        where: { user_id: profile.id },
    });

    // Buscar quantidade de seguidores
    const followersCount = await prisma.follow.count({
        where: { followed_id: profile.id },
    });

    // Buscar quantidade de seguindo
    const followingCount = await prisma.follow.count({
        where: { follower_id: profile.id },
    });

    const isOwnProfile = currentUser?.user?.id === profile.id;

    return (
        <div className="flex flex-col items-center relative">
            {/* Header do perfil (Profile + FollowBtn + Favorites) */}
            <UserHeader
                profile={profile}
                isUser={isOwnProfile}
                reviewCount={reviewCount || 0}
                followersCount={followersCount || 0}
                followingCount={followingCount || 0}
            />

            {/* Tabs de navegação */}
            <UserTabs username={profile.username!} />

            {/* Conteúdo da página ativa */}
            <div className="w-full max-w-2xl">{children}</div>
        </div>
    );
}
