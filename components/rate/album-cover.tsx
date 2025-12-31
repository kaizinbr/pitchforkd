"use client";
import Image from "next/image";

export default function AlbumCover({
    album,
    loading,
    display,
}: {
    album: any;
    loading: boolean;
    display?: boolean;
}) {
    return (
        <>
            <div
                className={`
                    my-8 flex justify-center items-center
                    ${display ? "min-w-32" : "w-full"}
                `}
            >
                {loading ? (
                    <div className={`
                        
                                ${display ? "size-32" : "size-64"}
                                rounded-xl bg-shark-500 animate-pulse
                        `}></div>
                ) : (
                    <picture>
                        <Image
                            src={album.images[0]?.url}
                            alt={album.name}
                            width={256}
                            height={256}
                            className={`
                                rounded-xl shadow-lg
                                ${display ? "size-32" : "size-64"}
                            `}
                        />
                    </picture>
                )}
            </div>
        </>
    );
}
