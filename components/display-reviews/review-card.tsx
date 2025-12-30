/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/components/ui/Avatar";
import { getPastRelativeTime, displayPastRelativeTime } from "@/lib/utils/time";
import axios from "axios";
import formatRate from "@/lib/utils/formatRate";


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

export default function ReviewCard({
    review,
    edit,
}: {
    review: Review;
    edit?: Boolean;
}) {
    const supabase = createClient();
    const [userProfiles, setUserProfiles] = useState<User | null>(null);
    const [userImg, setUserImg] = useState<string | null>(null);
    const [postImg, setPostImg] = useState<string | null>(null);

    const [postData, setPostData] = useState<any | null>(null);

    const [avatarUrl, setAvatarUrl] = useState<string | null>("");
    const [amIAuthor, setAmIAuthor] = useState<boolean>(false);

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
        <div
            className={`
                flex flex-col 
                bg-woodsmoke-700
                max-w-[600px] w-full
                transition-all duration-200 ease-in-out   
                rounded-3xl overflow-hidden relative
                review-${review.id}
        `}
        >
            <Link href={`/album/${review.album_id}/rate`} className="z-20">
                <div className="flex flex-row items-center gap-2">
                    <div className="flex relative flex-col justify-center items-center size-8 rounded-full">
                        <Avatar
                            size={32}
                            src={review.profiles.avatar_url}
                            className={"size-8"}
                        />
                    </div>
                    <div className="flex items-center justify-center flex-row gap-2">
                        <h2 className="text-sm text-neutral-100">
                            <span className="font-semibold">
                                {review.profiles.name || review.profiles.username} avaliou
                            </span>{" "}
                            <span className="font-bold">
                                {album && album.name}
                            </span>{" "}
                            <span className="font-semibold">
                                de
                            </span>{" "}
                            <span className="font-bold">
                                {album && album.artists[0].name}
                            </span>
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col relative max-w-[400px] max-h-[400px] rounded-2xl my-3 overflow-hidden">
                    {album && (
                        <picture className="w-full flex">
                            <Image
                                src={album.images[0].url}
                                alt={album.name}
                                width={500}
                                height={500}
                                className="object-cover w-full max-h-[400px] rounded-2xl"
                            />
                        </picture>
                    )}
                    <div className={`
                            absolute 
                            bg-neutral-900/30
                            backdrop-blur-0 hover:backdrop-blur-md
                            transition-all duration-200 ease-in-out
                            max-w-[400px] max-h-[400px] size-full 
                            flex justify-center items-center p-3 gap-2
                        `}>
                        <span className="text-neutral-100 text-3xl font-bold">
                            {formatRate(Number(review.total))}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-start flex-row px-3 pb-3 gap-2">
                    <span className=" h-full flex items-center text-xs text-stone-400 ">
                    {displayPastRelativeTime(new Date(review.created_at))}
                    </span>
                </div>
            </Link>
        </div>
    );
}
