import UserRatings from "@/components/user/UserRatings";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function UserReviewsPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;

    // Buscar dados do usuário
    const profile = await prisma.profile.findFirst({
        where: { lowername: username.toLowerCase() },
    });
    
    return (
        <div className="w-full pt-2">
            <UserRatings profile={profile} />
        </div>
    );
}