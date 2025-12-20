import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { username: string } }
) {
    const { username } = params;
    try {
        // `profiles` não possui campo único `username` no schema atual,
        // portanto usamos `findFirst` ao invés de `findUnique`.
        const perfil = await prisma.profiles.findFirst({
            where: { username: username },
        });
        if (!perfil) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ perfil }, { status: 200 });
    } catch (err) {
        console.error("fetch error", err);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

