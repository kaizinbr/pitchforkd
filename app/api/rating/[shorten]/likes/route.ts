import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ shorten: string }>;
    }
) {
    const { shorten } = await params;
    console.log("Fetching ratings for user:", shorten);

    try {
        if (!shorten) {
            return NextResponse.json(
                { error: "shorten is required" },
                { status: 400 }
            );
        }

        const ratingsWithLikes = await prisma.rating.findFirst({
            where: { shorten: shorten, published: true },
            include: { Like: true },
        });

        if (!ratingsWithLikes) {
            return NextResponse.json(
                { error: "Rating not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(ratingsWithLikes, { status: 200 });
    } catch (err) {
        console.error("fetch error", err);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}
