import { put } from "@vercel/blob";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json(
            { error: "User is not authenticated" },
            { status: 401 }
        );
    }
    
    if (!filename) {
        return NextResponse.json(
            { error: "Filename is required" },
            { status: 400 }
        );
    }

    if (!request.body) {
        return NextResponse.json(
            { error: "File body is required" },
            { status: 400 }
        );
    }

    const name = 
    `${filename}-${Date.now()}`

    const blob = await put(`avatar/${session.user.id}_${Date.now()}.webp`, request.body, {
        access: "public",
    });

    await prisma.profile.update({
        where: { id: session.user.id },
        data: { avatarUrl: blob.url },
    });

    return NextResponse.json(blob);
}

// import { put } from "@vercel/blob";
// import { NextResponse } from "next/server";

// export async function POST(request: Request): Promise<NextResponse> {
//     const { searchParams } = new URL(request.url);
//     const filename = searchParams.get("filename");

//     // ⚠️ The below code is for App Router Route Handlers only
//     const blob = await put(filename, request.body, {
//         access: "public",
//     });

//     // Here's the code for Pages API Routes:
//     // const blob = await put(filename, request, {
//     //   access: 'public',
//     // });

//     return NextResponse.json(blob);
// }

// // The next lines are required for Pages API Routes only
// // export const config = {
// //   api: {
// //     bodyParser: false,
// //   },
// // };
