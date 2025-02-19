"use client";
import { AlbumRate, Review, Rating } from "@/lib/utils/types";
import Avatar from "@/components/ui/Avatar";
import formatRate from "@/lib/utils/formatRate";
import Link from "next/link";

export default function UserRate({
    album,
    loading,
}: {
    album: Review;
    loading: boolean;
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
                    <p className="text-3xl font-bold mb-4">
                        {formatRate(album.total)}
                    </p>
                    {album.review == "" ? (
                        <p className="text-lg">Sem review</p>
                    ) : (
                        <div className="w-full flex flex-row gap-3">
                            <Link
                                href={`/${album.profiles.username}`}
                                className="flex relative flex-col justify-center items-center size-8 rounded-full mt-2"
                            >
                                <Avatar
                                    size={32}
                                    src={album.profiles.avatar_url}
                                    className={"size-8"}
                                    isIcon
                                />
                            </Link>
                            <div className="p-4 w-full bg-bunker-800 rounded-xl text-sm">
                                <p className="">{album.review}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
