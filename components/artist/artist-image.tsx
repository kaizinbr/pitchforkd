"use client";
import Image from "next/image";

export default function ArtistImage({
    artist,
    loading,
}: {
    artist: any;
    loading: boolean;
}) {

    return (
        <>
            
            <div className="w-full my-16 md:mt-32 flex justify-center items-center">
                {loading ? (
                    <div className="size-64 rounded-full bg-bunker-500"></div>
                ) : (
                    <picture>
                        <Image
                            src={artist.images[0]?.url}
                            alt={artist.name}
                            width={256}
                            height={256}
                            className="rounded-full size-64 shadow-lg"
                        />
                    </picture>
                ) }
            </div>
        </>
    );
}
