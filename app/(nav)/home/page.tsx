import DisplayReviews from "@/components/display-reviews/main";
import Link from "next/link";
import { HiUsers, HiBell } from "react-icons/hi2";
import Icon from "@/components/ui/Icon";

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
                <div className="flex flex-row justify-between items-center w-full px-5">
                    <Link
                        href={`https://pitchforkd.me/`}
                        className="font-bold text-xl md:hidden text-start"
                    >
                        Whistle
                    </Link>

                    <div className="flex flex-row gap-2">
                        <Link
                            href={`/users`}
                            className={`
                                        flex cursor-pointer
                                        flex-col items-center gap-1 rounded-8
                                        data-[active=true]:text-main-500
                                        hover:text-main-500
                                        transition-all duration-200 ease-in-out
                                    `}
                        >
                            <HiUsers className="size-6" />
                        </Link>
                        <Link
                            href={`/notifications`}
                            className={`
                                        flex cursor-pointer
                                        flex-col items-center gap-1 rounded-8
                                        data-[active=true]:text-main-500
                                        hover:text-main-500
                                        transition-all duration-200 ease-in-out
                                    `}
                        >
                            <HiBell className="size-6" />
                        </Link>
                    </div>
                </div>
                <TopFeed />
                <div className="w-full max-w-2xl px-4">
                    <div className="rounded-lg text-sm p-4 bg-main-900/70 border border-main-600">
                        <p className="">
                            Esse serviço utiliza a base de dados do Spotify para
                            prover um catálogo amplo de informações.
                            Recentemente, em 11/02/2026, o Spotify implementou
                            mudanças em sua API, limitando o acesso a dados e
                            diminuindo a gama de serviços. Devido a essas
                            mudanças, o serviço pode apresentar limitações na
                            exibição de informações. Caso encontre algum
                            problema, por favor nos informe{" "}
                            <Link className="underline" href="/about#contato">
                                aqui
                            </Link>
                            .
                        </p>
                    </div>
                </div>
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
