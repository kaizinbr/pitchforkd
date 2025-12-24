import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

export async function DELETE(
        request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ shorten: string }>;
    }
) {
    const { shorten } = await params;
    const session = await auth();
    console.log("Deleting ratings for user:", shorten);
    try {
        if (!shorten) {
            return NextResponse.json(
                { error: "shorten is required" },
                { status: 400 }
            );
        }

        const rating = await prisma.rating.findFirst({
            where: { shorten: shorten },
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



        const deletedRating = await prisma.rating.deleteMany({
            where: { shorten: shorten },
        });

        return NextResponse.json(deletedRating, { status: 200 });
    } catch (err) {
        console.error("delete error", err);
        return NextResponse.json(
            { error: "Failed to delete rating" },
            { status: 500 }
        );
    }

}