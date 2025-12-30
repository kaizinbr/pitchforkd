import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers'


import { auth } from "@/auth";

export async function POST(
    request: NextRequest,
) {

    const { username, lowername, site, name, bio, pronouns } = await request.json();
    const session = await auth();
    const cookieStore = await cookies();
    const newUserCookie = cookieStore.get("new");

    try {
        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        await prisma.profile.update({
            where: { id: session?.user!.id },
            data: {
                username: username,
                lowername: username.toLowerCase(),
                site: site || null, 
                // avatarUrl: avatar_url || null,
                name: name || null,
                bio: bio || null,
                pronouns: pronouns || null,
            },
        });

        if (newUserCookie) {
            cookieStore.delete("new");
        }

        return NextResponse.json(
            { message: "Profile updated successfully" },
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
