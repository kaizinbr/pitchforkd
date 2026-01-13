import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";

import { auth } from "@/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    const currentUser = await auth();

    try {
        const userProfile = await prisma.profile.findFirst({
            where: { lowername: username.toLowerCase() },
        });

        if (!userProfile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        if (!currentUser?.user?.id) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        if (currentUser.user.id === userProfile.id) {
            return NextResponse.json(
                { error: "Cannot follow yourself" },
                { status: 400 }
            );
        }

        const followCheck = await prisma.follow.findMany({
            where: {
                followerId: currentUser?.user!.id,
                followedId: userProfile.id,
            },
        });

        if (followCheck.length === 0) {
            return NextResponse.json(
                { isFollowing: false, follow: null },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                isFollowing: followCheck.length > 0,
                follow: {
                    id: Number(followCheck[0].id),
                    followerId: followCheck[0]?.followerId,
                    followedId: followCheck[0]?.followedId,
                    createdAt: followCheck[0]?.createdAt,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("fetch error", err);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

// export async function POST(request: Request) {
//     try {
//         const { shorten, content, title, tags, raw, published, color, image } =
//             await request.json();

//         const session = await auth();

//         if (!session?.user?.id) {
//             return NextResponse.json(
//                 { error: "Parece que não está autenticado" },
//                 { status: 401 }
//             );
//         }

//         const post = await prisma.post.upsert({
//             where: { shorten },
//             update: {
//                 content,
//                 title,
//                 tags: {
//                     connectOrCreate: tags.map((name: string) => ({
//                         where: { name },
//                         create: { name },
//                     })),
//                 },
//                 raw,
//                 published,
//                 color,
//                 image,
//             },
//             create: {
//                 shorten,
//                 content,
//                 title,
//                 tags: {
//                     connectOrCreate: tags.map((name: string) => ({
//                         where: { name },
//                         create: { name },
//                     })),
//                 },
//                 raw,
//                 published,
//                 color,
//                 image,
//                 authorId: session.user.id,
//             },
//         });

//         console.log("post created");

//         return NextResponse.json({ post }, { status: 201 });
//     } catch (err) {
//         console.error("upload error", err);

//         return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//     }
// }
