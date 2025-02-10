/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/components/ui/Avatar";

import useToday from "@/hooks/today";
import { getPastRelativeTime } from "@/lib/utils/time";
import axios from "axios";

interface Props {
    date: Date;
}

function PastRelativeTime({ date }: Props) {
    const today = useToday();
    const relativeTime = getPastRelativeTime(date, today);

    return <>{relativeTime}</>;
}

interface Review {
    id: string;
    created_at: string;
    user_id: string;
    album_id: string;
    review: string;
    ratings: [
        {
            id: string;
            value: number;
            favorite: boolean;
        },
    ];
    total: number;
    profiles: User;
}

interface User {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    site: string;
    bio: string;
    pronouns: string;
}

export default function RatingCard({
    review,
    edit,
}: {
    review: Review;
    edit?: Boolean;
}) {
    const [album, setAlbum] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `/api/spot/album/${review.album_id}`
            );
            // console.log(response.data);
            setAlbum(response.data);
            setLoading(false);
        };

        fetchData();
    }, [review.album_id]);

    return (
        <div>
            {loading ? (
                <div
                    className={`
                    flex flex-col 
                    max-w-[600px] w-full
                    transition-all duration-200 ease-in-out   
                    overflow-hidden relative
                    my-6
            `}
                >
                    <div className="z-20">
                        <div className="flex flex-row items-center gap-2">
                            <div className="flex relative flex-col justify-center items-center size-8 rounded-full">
                                <div
                                    className={
                                        "size-8 rounded-full bg-neutral-600"
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-row relative rounded-2xl my-3 overflow-hidden">
                            <div className="object-cover size-40 bg-neutral-600 max-h-[160px] rounded-xl" />
                            <div
                                className={`
                                flex flex-col justify-start items-start px-3 gap-2
                                w-[calc(100%-160px)]
                            `}
                            ></div>
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
                        max-w-[600px] w-full
                        transition-all duration-200 ease-in-out   
                        overflow-hidden relative
                        review-${review.id} my-6
                `}
                >
                    <Link
                        href={`/${review.profiles.username}/rate/${review.album_id}`}
                        className="z-20"
                    >
                        <div className="flex flex-row items-start gap-2">
                            <div className="flex relative flex-col justify-center items-center size-8 rounded-full">
                                <Avatar
                                    size={32}
                                    src={review.profiles.avatar_url}
                                    className={"size-8"}
                                />
                            </div>
                            <div className="flex items-center justify-center flex-row gap-2">
                                <h2 className="text-sm text-neutral-100">
                                    <span className="">
                                        {review.profiles.name} avaliou
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

                        <div className="flex flex-row relative rounded-2xl my-3 overflow-hidden">
                            {album && (
                                <picture className=" size-40">
                                    <Image
                                        src={album.images[0].url}
                                        alt={album.name}
                                        width={500}
                                        height={500}
                                        className="object-cover size-40 max-h-[160px] rounded-xl"
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
                                    {review.total.toFixed(1)}/100
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
                        <div className="flex items-center justify-start flex-row gap-2">
                            <span className=" h-full flex items-center text-xs text-stone-400 ">
                                <PastRelativeTime
                                    date={new Date(review.created_at)}
                                />
                            </span>
                        </div>
                    </Link>
                </div>
            ) : (
                <div>Album not found</div>
            )}
        </div>
    );
}
