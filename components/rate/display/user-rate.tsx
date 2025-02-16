"use client";
import { AlbumRate, Review, Rating } from "@/lib/utils/types";
import Avatar from "@/components/ui/Avatar";
import formatRate from "@/lib/utils/formatRate";

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
                        Avaliação de {album.profiles.name}
                    </h2>
                    <p className="text-3xl font-bold mb-4">{formatRate(album.total)}</p>
                    {album.review == "" ? (
                        <p className="text-lg">Sem review</p>
                    ) : (
                        <div className="w-full flex flex-row gap-3">
                            <picture className="flex relative flex-col justify-center items-center size-8 rounded-full mt-3">
                                <Avatar
                                    size={32}
                                    src={album.profiles.avatar_url}
                                    className={"size-8"}
                                    isIcon
                                />
                            </picture>
                            <div className="p-4 w-full bg-neutral-800 rounded-xl">
                                <p className="text-base">{album.review}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
