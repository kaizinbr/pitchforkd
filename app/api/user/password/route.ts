import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers'
import bcrypt from "bcryptjs";


import { auth } from "@/auth";

export async function POST(
    request: NextRequest,
) {
    const { password } = await request.json();
    const session = await auth();
    const cookieStore = await cookies();
    const newUserCookie = cookieStore.get("new");

    try {
        if (!password) {
            return NextResponse.json(
                { error: "Password is required" },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: { id: session?.user!.id },
            data: {
                encryptedPassword: await bcrypt.hash(password, 10),
            },
        });

        if (newUserCookie) {
            cookieStore.delete("new");
        }

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error("fetch error", err);
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}
