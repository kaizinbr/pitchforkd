import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from "axios";

import { auth } from "@/auth";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    const currentUser = await auth();    
    const { ACTION } = await request.json();

    try {
        const userProfile = await prisma.profile.findFirst({
            where: { lowername: username.toLowerCase() },
        }); 

        if (!userProfile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        if (!currentUser?.user?.id) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        if (currentUser.user.id === userProfile.id) {
            return NextResponse.json(
                { error: "Cannot follow yourself" },
                { status: 400 }
            );
        }

        if (ACTION === "FOLLOW") {
            const newFollow = await prisma.follow.create({
                data: {
                    followerId: currentUser.user.id,
                    followedId: userProfile.id,
                },
            }); 
            return NextResponse.json(
                {
                    message: "Successfully followed user",  
                    follow: newFollow,
                },
                { status: 201 }
            );
        }
        if (ACTION === "UNFOLLOW") {
            const deletedFollow = await prisma.follow.deleteMany({
                where: {    
                    followerId: currentUser.user.id,
                    followedId: userProfile.id,
                },  
            });
            return NextResponse.json(
                {
                    message: "Successfully unfollowed user",    
                    follow: deletedFollow,
                },
                { status: 200 }
            );
        }

    } catch (err) {
        console.error("fetch error", err);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}
