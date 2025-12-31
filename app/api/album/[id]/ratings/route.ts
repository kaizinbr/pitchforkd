import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";
import getShorten from "@/lib/utils/getShorten";

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
    console.log("checking ratings for user:", id);
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
                { message: "Avaliação não existe", avaliou: false },
                { status: 200 }
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

export async function POST(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    }
) {
    const { id } = await params;
    const { albumId, ratings, review, content, total, published } =
        await request.json();

    const session = await auth();

    try {
        if (!id) {
            return NextResponse.json(
                { error: "id is required" },
                { status: 400 }
            );
        }

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const existsingRating = await prisma.rating.findFirst({
            where: { albumId: id, userId: session?.user?.id },
        });

        if (existsingRating) {
            const updatedRating = await prisma.rating.update({
                where: { id: existsingRating.id },
                data: {
                    ratings,
                    review,
                    content,
                    total,
                    published,
                },
            });
            return NextResponse.json(
                {
                    message: "Atualizado com sucesso",
                    save: true,
                    data: updatedRating,
                },
                { status: 200 }
            );
        } else {
            const shorten = getShorten();
            const newRating = await prisma.rating.create({
                data: {
                    userId: session?.user?.id || "",
                    albumId: id,
                    shorten,
                    ratings,
                    review,
                    content,
                    total,
                    published,
                },
            });
            return NextResponse.json({
                    message: "Salvo com sucesso",
                    save: true,
                    data: newRating,
                }, { status: 201 });
        }
    } catch (err) {
        console.error("fetch error", err);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}
