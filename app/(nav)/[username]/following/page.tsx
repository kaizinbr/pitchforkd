import FollowList from "@/components/user/FollowersList";

import { prisma } from "@/lib/prisma";

export default async function FollowingPage({
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

    const followings = await prisma.follow.findMany({
        where: {
            followerId: userId!,
        },
        select: { followedId: true, followed: true },
    });

    // console.log(followings)


    if (!followings) {
        console.error("Error fetching followings");
        return null;
    }

    return (
        <div className="w-full pt-2">
            {followings && followings.length > 0 ? (
                <FollowList follows={followings} />
            ) : (
                <div className="w-full flex items-center justify-center">
                    <p className="text-neutral-500">
                        Parece que esse usuário não segue ninguém ainda
                    </p>
                </div>
            )}
        </div>
    );
}
