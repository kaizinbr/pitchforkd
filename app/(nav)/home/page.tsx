import DisplayReviews from "@/components/display-reviews/main";
import AlbunsCarousel from "@/components/carousel/carousel";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import TopFeed from "@/components/home/top-feed";

export default async function Home() {
    const reviews = await prisma.rating.findMany({
        where: {
            published: true,
        },
        include: {
            Profile: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 20,
    });

    const totalReviews = await prisma.rating.count({
        where: {
            published: true,
        },
    });

    return (
        <>
            <main className="flex-1 flex flex-col gap-6 pt-8 md:pt-20 h-lvh justify-center items-center w-full">
                <Link
                    href={`https://pitchforkd.me/`}
                    className="font-bold mb-4 pl-5 text-xl md:hidden w-full text-start"
                >
                    Whistle
                </Link>
                <TopFeed />
                {reviews && totalReviews ? (
                    <DisplayReviews
                        ratings={reviews}
                        ratingsLength={totalReviews}
                    />
                ) : (
                    <div>Não há reviews</div>
                )}
            </main>
        </>
    );
}
