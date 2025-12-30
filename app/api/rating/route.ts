import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

export async function GET(
    request: NextRequest,
) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("p"); // cada pagina vai puxar 20, se page=full vai puxar todos
    console.log("and page:", page);

    try {
        if (page === "full") {
            const ratings = await prisma.rating.findMany({
                where: {
                    published: true,
                },
                orderBy: { createdAt: "desc" },
            });

            if (!ratings || ratings.length === 0) {
                return NextResponse.json(
                    {
                        total: 0,
                        page: null,
                        next: 0,
                        prev: 0,
                        ratings,
                    },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                {
                    total: ratings.length,
                    page: "full",
                    next:
                        ratings.length > (page ? parseInt(page) * 10 : 10)
                            ? page
                                ? parseInt(page) + 1
                                : 2
                            : null,
                    prev:
                        page && parseInt(page) > 1 ? parseInt(page) - 1 : null,
                    ratings,
                },
                { status: 200 }
            );
        }

        if (!page || isNaN(parseInt(page))) {
            return NextResponse.json(
                { error: "Invalid page parameter" },
                { status: 400 }
            );
        }

        const index = page ? (parseInt(page) - 1) * 20 : 0;

        console.log(
            "from index:",
            index
        );

        const ratings = await prisma.rating.findMany({
            where: {
                published: true,
            },
            include: {
                Profile: true,
            },
            orderBy: { createdAt: "desc" },
            skip: index,
            take: 20,
        });

        const totalRatings = await prisma.rating.count({
            where: {
                published: true,
            },
        });

            if (!ratings || ratings.length === 0) {
                return NextResponse.json(
                    {
                        total: 0,
                        page: null,
                        next: 0,
                        prev: 0,
                        ratings,
                    },
                    { status: 200 }
                );
            }

        return NextResponse.json(
            {
                total: totalRatings,
                page: page ? parseInt(page) : 1,
                next:
                    page && parseInt(page) * 20 < totalRatings
                        ? parseInt(page) + 1
                        : null,
                prev: page && parseInt(page) > 1 ? parseInt(page) - 1 : null,
                ratings,
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
