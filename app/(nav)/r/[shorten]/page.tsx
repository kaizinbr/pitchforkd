import { createClient } from "@/utils/supabase/server";
import DisplayRate from "@/components/rate/display/display-rate-page";
import type { Metadata, ResolvingMetadata } from "next";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Props = {
    params: Promise<{ shorten: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const shorten = (await params).shorten;

    const userProfile = await prisma.rating.findFirst({
        where: { shorten: shorten },
        select: {
            Profile: {
                select: {
                    name: true,
                    username: true,
                },
            },
        },
    });

    return {
        title: userProfile
            ? `Avaliação de ${userProfile?.Profile!.name || userProfile?.Profile!.username} | Pitchforkd`
            : "Avaliação | Pitchforkd",
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ shorten: string }>;
}) {
    const shorten = (await params).shorten;

    const rating = await prisma.rating.findFirst({
        where: { shorten: shorten },
        include: {
            Profile: true,
        },
    })
    .then((rate) => {
        if (rate && rate.total) {
            return {
                ...rate,
                total: Number(rate.total),
            };
        }
        return rate;
    });

    // console.log("Fetched rating:", rating);

    if (!rating) {
        console.error("Error fetching album");
        return (
            <div className="h-full min-h-screen w-full flex">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-2xl">Avaliação não encontrada</div>
                </div>
            </div>
        );
    }

    const session = await auth();

    return (
        <div className="flex flex-col gap-4 items-center relative">
            {rating ? (
                <DisplayRate rate={rating} userLogged={session?.user} />
            ) : (
                <div className="h-full min-h-screen w-full flex">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-2xl">Avaliação não encontrada</div>
                    </div>
                </div>
            )}
        </div>
    );
}
