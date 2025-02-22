/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback, use } from "react";
import { Skeleton } from "@mantine/core";
import Avatar from "@/components/ui/Avatar";
import { Review } from "@/lib/utils/types";
import { createClient } from "@/utils/supabase/client";
import useToday from "@/hooks/today";
import { getPastRelativeTime } from "@/lib/utils/time";
import axios from "axios";
import formatRate from "@/lib/utils/formatRate";
import LikeBtn from "./like-btn";
import { TbDots } from "react-icons/tb";
import Options from "../rate/display/options";

interface Props {
    date: Date;
}

export function PastRelativeTime({ date }: Props) {
    const today = useToday();
    const relativeTime = getPastRelativeTime(date, today);

    return <>{relativeTime}</>;
}

export default function RatingCard({
    review,
    edit,
}: {
    review: Review;
    edit?: boolean;
}) {
    const supabase = createClient();
    const [album, setAlbum] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const verifyLike = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                console.error("User not logged in");
                return;
            }

            const { data, error } = await supabase
                .from("likes")
                .select("*")
                .eq("user_id", user.id)
                .eq("rating_id", review.id);

            if (error) {
                console.error(error);
                return;
            }

            if (data.length) {
                setLiked(true);
            }
        };

        verifyLike();
    }, [review.id]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `/api/spot/album/${review.album_id}`
            );
            setAlbum(response.data);
            setLoading(false);
        };

        fetchData();
    }, [review.album_id]);

    return (
        <>
            {loading ? (
                <div
                    className={`
                        flex flex-col 
                        max-w-2xl w-full
                        transition-all duration-200 ease-in-out   
                        overflow-hidden relative
                        p-5
                `}
                >
                    <div className="z-20">
                        <div className="flex flex-row items-center gap-2">
                            <Skeleton height={32} circle />
                            <div className="flex w-[calc(100%-40px)] items-start justify-center flex-col gap-2">
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" width="70%" />
                            </div>
                        </div>

                        <div className="flex flex-row relative rounded-2xl my-3 overflow-hidden">
                            <Skeleton height={160} width={160} radius="lg" />
                            <div
                                className={`
                                flex flex-col justify-start items-start px-3 gap-2
                                w-[calc(100%-160px)]
                            `}
                            >
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" width="70%" />
                            </div>
                        </div>
                        <div className="flex items-center justify-start flex-row gap-2">
                            <span className=" h-full flex items-center text-xs text-stone-400 "></span>
                        </div>
                    </div>
                </div>
            ) : album ? (
                <div
                    className={`
                        flex flex-col 
                        max-w-2xl w-full
                        overflow-hidden relative
                        review-${review.id}
                        z-20
                `}
                >
                    <div
                        className={`
                            z-20 size-full bor border-bunker-800 p-4 relative
                            md:rounded-2xl
                            bg-transparent hover:bg-bunker-800
                            transition-all duration-200 ease-in-out   
                        `}
                    >
                        <Link
                            href={`/r/${review.shorten}`}
                            className={`
                            flex flex-col *:w-full
                            `}
                        >
                            <div className="flex flex-row items-start gap-2">
                                <div className="flex relative flex-col justify-center items-center size-8 rounded-full">
                                    <Avatar
                                        size={32}
                                        src={review.profiles.avatar_url}
                                        className={"size-8"}
                                        isIcon
                                    />
                                </div>
                                <div className="flex items-start justify-center flex-row gap-2">
                                    <h2 className="text-sm text-neutral-100">
                                        <span className="">
                                            {review.profiles.name ||
                                                review.profiles.username}{" "}
                                            avaliou
                                        </span>{" "}
                                        <span className="font-semibold">
                                            {album && album.name}
                                        </span>{" "}
                                        <span className="">de</span>{" "}
                                        <span className="font-semibold">
                                            {album && album.artists[0].name}
                                        </span>
                                    </h2>
                                </div>
                            </div>
                            <div className="flex flex-row relative my-3">
                                {album && (
                                    <picture className=" size-40">
                                        <Image
                                            src={album.images[0].url}
                                            alt={album.name}
                                            width={500}
                                            height={500}
                                            className="object-cover size-40 max-h-[160px] rounded-lg"
                                        />
                                    </picture>
                                )}
                                <div
                                    className={`
                                        flex flex-col justify-start items-start px-3 gap-2
                                        w-[calc(100%-160px)]
                                    `}
                                >
                                    <span className="text-neutral-100 text-xl font-bold">
                                        {formatRate(review.total)}
                                    </span>
                                    {review.review && (
                                        <p className="text-neutral-100 text-sm line-clamp-4">
                                            {review.review}
                                        </p>
                                    )}
                                    <span className="text-neutral-300 text-sm">
                                        {review.ratings.length} músicas
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between flex-row gap-2">
                                <span className=" h-full flex items-center text-xs text-bunker-400 ">
                                    <PastRelativeTime
                                        date={new Date(review.created_at)}
                                    />
                                </span>
                            </div>
                        </Link>
                        <LikeBtn
                            rating_id={review.id}
                            owner_id={review.user_id}
                            liked={liked}
                            setLiked={setLiked}
                            className="absolute bottom-5 right-5"
                        />
                    </div>
                </div>
            ) : (
                <div>Album not found</div>
            )}
        </>
    );
}
