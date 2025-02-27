"use client";
import { AlbumRate, Review, Rating } from "@/lib/utils/types";
import Avatar from "@/components/ui/Avatar";
import formatRate from "@/lib/utils/formatRate";
import Link from "next/link";
import { displayPastRelativeTime } from "@/lib/utils/time";

export default function UserRate({
    album,
    loading,
    likes,
}: {
    album: Review;
    loading: boolean;
    likes: number;
}) {
    return (
        <div className="w-full max-w-2xl px-5">
            {loading ? (
                <div className=""></div>
            ) : (
                <div className="flex flex-col gap-2 items-">
                    <h2 className="text-xl font-bold">
                        Avaliação de{" "}
                        <Link href={`/${album.profiles.username}`}>
                            {album.profiles.name || album.profiles.username}
                        </Link>
                    </h2>
                    <p className="text-3xl font-bold">
                        {formatRate(album.total)}
                    </p>
                    {album.review == "" ? (
                        <p className="text-bunker-300 text-sm">
                            {displayPastRelativeTime(
                                new Date(album.created_at)
                            )}
                        </p>
                    ) : (
                        <div className="p-3 w-full flex flex-col gap-3 bg-bunker-800 rounded-xl">
                            <div className="w-full flex flex-row gap-2 items-center">
                                <Link
                                    href={`/${album.profiles.username}`}
                                    className="flex relative flex-col justify-center items-center size-10 rounded-full"
                                >
                                    <Avatar
                                        size={40}
                                        src={album.profiles.avatar_url}
                                        className={"size-10"}
                                        isIcon
                                    />
                                </Link>
                                <div className="flex flex-col items-start justify-center">
                                    <Link
                                        href={`/${album.profiles.username}`}
                                        className="flex flex-row justify-start items-center gap-2 text-sm"
                                    >
                                        <p className=" font-medium">
                                            {album.profiles.name}
                                        </p>
                                        <p className="text-bunker-300 text-xs">
                                            @{album.profiles.username}
                                        </p>
                                    </Link>
                                    {album.profiles.pronouns && (
                                        <div className="flex flex-row justify-start items-center text-xs gap-2 text-bunker-400">
                                            <p className=" font-semibold">
                                                {album.profiles.pronouns}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full text-sm">
                                {album.review
                                    .split("\n")
                                    .map((paragraph, index) => (
                                        <p key={index} className="not-last:mb-1">
                                            {paragraph}
                                        </p>
                                    ))}
                            </div>
                            <div className="flex items-center justify-start flex-row gap-1 text-xs text-bunker-400 ">
                                <span className=" h-full flex items-center">
                                    {displayPastRelativeTime(
                                        new Date(album.created_at)
                                    )}
                                </span>
                                <span className="">•</span>
                                <span>
                                    {likes === 1 ? "1 curtida" : `${likes} curtidas`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
