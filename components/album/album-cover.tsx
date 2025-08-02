"use client";
import Image from "next/image";

export default function AlbumCover({
    album,
    loading,
}: {
    album: any;
    loading: boolean;
}) {

    return (
        <>
            
            <div className="w-full my-8 md:mt-32 flex justify-center items-center">
                {loading ? (
                    <div className="size-64 rounded-xl bg-bunker-500"></div>
                ) : (
                    <picture>
                        <Image
                            src={album.images[0]?.url}
                            alt={album.name}
                            width={256}
                            height={256}
                            className="rounded-xl size-64 shadow-lg"
                        />
                    </picture>
                ) }
            </div>
        </>
    );
}
