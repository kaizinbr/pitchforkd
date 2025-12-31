"use client";

import { useEffect, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import { darkenColor } from "@/components/album/gen-gradient";
import axios from "axios";
import AlbumCover from "@/components/rate/album-cover";
import AlbumData from "@/components/album/album-data";
import { AlbumRate, Review } from "@/lib/utils/types";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import LikeBtn from "@/components/user/like-btn";
import useScrollDirection from "@/hooks/useScrollDirection";

import { auth } from "@/auth";
import { fetchUser } from "@/lib/utils/fetchUser";

export default function RaterAlbumCover({
    album,
}: {
    album: any;
}) {
    const supabase = createClient();
    const scrollDirection = useScrollDirection();

    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [canDelete, setCanDelete] = useState(false);
    const [liked, setLiked] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);

    const [vibrantColor, setVibrantColor] = useState<string>("#ffffff");
    const [mutedColor, setMutedColor] = useState<string>("#ffffff");
    const [darkVibrantColor, setDarkVibrantColor] = useState<string>("#ffffff");
    const [darkMutedColor, setDarkMutedColor] = useState<string>("#ffffff");
    const [lightVibrantColor, setLightVibrantColor] =
        useState<string>("#ffffff");
    const [lightMutedColor, setLightMutedColor] = useState<string>("#ffffff");
    const [textColor, setTextColor] = useState<string>("#222");

    useEffect(() => {
        const fetchData = async () => {
            
            setLoading(false);

            Vibrant.from(album.images[0]?.url)
                .getPalette()
                .then((palette) => {
                    console.log(palette);
                    // setColors(palette);
                    if (palette.Vibrant) {
                        const rgb = palette.Vibrant.rgb;
                        setVibrantColor(`rgb(${rgb.join(", ")})`);
                        console.log("Vibrant Color RGB:", rgb);
                        setVibrantColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
                    }

                    if (palette.Vibrant?.titleTextColor) {
                        setTextColor(palette.Vibrant.titleTextColor);
                    }

                    if (palette.Muted) {
                        const rgb = palette.Muted.rgb;
                        setMutedColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
                    }

                    if (palette.DarkVibrant) {
                        const rgb = palette.DarkVibrant.rgb;
                        setDarkVibrantColor(
                            `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
                        );
                    }
                    if (palette.DarkMuted) {
                        const rgb = palette.DarkMuted.rgb;
                        setDarkMutedColor(
                            `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
                        );
                    }
                    if (palette.LightVibrant) {
                        const rgb = palette.LightVibrant.rgb;
                        setLightVibrantColor(
                            `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
                        );
                    }
                    if (palette.LightMuted) {
                        const rgb = palette.LightMuted.rgb;
                        setLightMutedColor(
                            `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
                        );
                    }
                });

            setLoading(false);
        };


        fetchData();
        fetchUser();
    }, [album]);

    return (
        <>
            {album && (
                <>
                    <div
                        className={`
                            absolute h-44 w-full -z-50 from-40 
                            top-0
                            transition-all duration-200 ease-in-out overflow-hidden
                            bg-blend-screen
                        `}
                        style={{
                            backgroundImage: `linear-gradient(to bottom, ${darkenColor(darkVibrantColor, 0.5)}, transparent)`,
                            // filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                        }}
                    >
                        <div className="absolute inset-0 max-w-sm m-auto flex items-center justify-center blur-3xl">
                            <div
                                style={{ backgroundColor: vibrantColor }}
                                className={`absolute rounded-full size-30 -top-2/4 -left-1/4 blur-2xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: mutedColor }}
                                className={`absolute rounded-full -right-1/4 -top-3/4 size-36 blur-2xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: lightVibrantColor }}
                                className={`absolute rounded-full left-1/3 -top-3/4 size-30 blur-2xl`}
                            ></div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full items-end gap-4 px-5 mx-auto max-w-2xl">
                        <AlbumCover
                            display={true}
                            album={album}
                            loading={loading}
                        />
                        <div className="text-white h-32 mb-8">
                            <p className="text-xs text-gray-200 mb-1 mt-4">
                                Você está avaliando
                            </p>
                            <h2 className="text-xl font-bold">{album.name}</h2>
                            <p className="font-medium mb-2">
                                {album.artists.map(
                                    (artist: any, index: number) => (
                                        <Link
                                            href={`/artist/${artist.id}`}
                                            key={artist.id}
                                        >
                                            {artist.name}
                                            {index < album.artists.length - 1 &&
                                                ", "}
                                        </Link>
                                    )
                                )}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
