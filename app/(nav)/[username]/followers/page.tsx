import FollowList from "@/components/user/FollowersList";
import { prisma } from "@/lib/prisma";

export default async function FollowersPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;

    
    const userId = await prisma.profile
        .findFirst({
            where: { lowername: username.toLowerCase() },
        })
        .then((profile) => profile?.id);

        console.log("User ID:", userId);

    const followeds = await prisma.follow.findMany({
        where: {
            followedId: userId!,
        },
        select: { followerId: true, follower: true },
    });


    return (
        <div className="w-full pt-2">
            {followeds && followeds.length > 0 ? (
                <FollowList follows={followeds} />
            ) : (
                <div className="w-full flex items-center justify-center">
                    <p className="text-neutral-500">Nenhum seguidor encontrado.</p>
                </div>
            )}
        </div>
    );
}
