import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

export async function POST(
    request: NextRequest,
) {
    const { artists } = await request.json();
    const session = await auth();

    try {
        if (!session?.user) {
            return NextResponse.json(
                { error: "User is not authenticated" },
                { status: 400 }
            );
        }

        await prisma.profile.update({
            where: { id: session?.user!.id },
            data: {
                artists: artists,
            },
        });

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
