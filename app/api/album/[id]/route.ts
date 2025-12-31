import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

export async function GET(
        request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    }
) {
    const { id } = await params;
    const session = await auth();
    console.log("Deleting ratings for user:", id);
    try {
        if (!id) {
            return NextResponse.json(
                { error: "id is required" },
                { status: 400 }
            );
        }

        const rating = await prisma.rating.findFirst({
            where: { albumId: id },
        });
        
        if (!rating) {
            return NextResponse.json(
                { error: "Rating not found" },
                { status: 404 }
            );
        }

        if (rating.userId !== session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized to delete this rating" },
                { status: 403 }
            );
        }

        return NextResponse.json(rating, { status: 200 });
    } catch (err) {
        console.error("delete error", err);
        return NextResponse.json(
            { error: "Failed to delete rating" },
            { status: 500 }
        );
    }

}