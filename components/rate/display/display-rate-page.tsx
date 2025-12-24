"use client";

import { useEffect, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import { darkenColor } from "@/components/album/gen-gradient";
import axios from "axios";
import AlbumCover from "@/components/album/album-cover";
import AlbumData from "@/components/album/album-data";
import { AlbumRate, Review } from "@/lib/utils/types";
import UserRate from "./user-rate";
import AlbumTracksDisplay from "./display-tracks";
import ShareBtn from "./share-btn";
import Link from "next/link";
import DeleteBtn from "./options";
import { createClient } from "@/utils/supabase/client";
import LikeBtn from "@/components/user/like-btn";
import useScrollDirection from "@/hooks/useScrollDirection";

import { auth } from "@/auth";
import { fetchUser } from "@/lib/utils/fetchUser";

export default function DisplayRate({
    id,
    rate,
    userLogged,
}: {
    id?: string;
    rate: Review | any;
    userLogged?: any;
}) {
    const supabase = createClient();
    const scrollDirection = useScrollDirection();

    const [album, setAlbum] = useState<any>();
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
            const response = await axios.get(`/api/spot/album/${rate.albumId}`);
            // console.log(response.data);
            setAlbum(response.data);
            setTracks(response.data.tracks.items);

            if (response.data.total_tracks > 50) {
                console.log("Mais de 50 músicas");

                const offsetTimes = Math.ceil(response.data.total_tracks / 50);

                let tracks2: any[] = response.data.tracks.items;

                for (let i = 0; i < offsetTimes; i++) {
                    if (i === 0) {
                        null;
                    } else {
                        const response = await axios.get(
                            `/api/spot/album/${id}/tracks?offset=${i * 50}`
                        );
                        tracks2 = [...tracks2, ...response.data.items];
                        console.log("Offset:", i * 50);
                    }
                }
                console.log("Tracks:", tracks2);
                setTracks(tracks2);
            }

            setLoading(false);

            Vibrant.from(response.data.images[0]?.url)
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

        const user = async () => {
            return await fetchUser()
        };

        if (userLogged?.id === rate.Profile.id) {
            setCanDelete(true);
        }

        const verifyLike = async () => {
            const response = await axios.get(`/api/rating/${rate.shorten}/likes`);
            console.log("Likes fetched:", response.data);

            const likes = response.data.Like || [];

            

            const userLike = likes.find(
                (like: any) => like.userId === userLogged?.id
            );
            if (userLike) {
                setLiked(true);
            }

            setTotalLikes(likes.length);
        };

        verifyLike();
        fetchData();
        fetchUser();
    }, [id]);

    return (
        <>
            {album && (
                <>
                    <div
                        className={`
                            absolute h-64 w-full -z-50 from-40 
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
                                className={`absolute rounded-full size-44 -top-1/3 -left-1/4 blur-3xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: mutedColor }}
                                className={`absolute rounded-full -right-1/4 -top-1/3 size-44 blur-3xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: lightVibrantColor }}
                                className={`absolute rounded-full left-1/3 -top-6 w-36 h-16 rotate-45 blur-3xl`}
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
                                {(() => {
                                    switch (album.album_type) {
                                        case "album":
                                            return "Álbum";
                                        case "single":
                                            return "Single/EP";
                                        case "compilation":
                                            return "Compilação";
                                        default:
                                            return "Outro";
                                    }
                                })()}
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
                    {canDelete ? <DeleteBtn shorten={rate.shorten} /> : null}
                    <ShareBtn shorten={rate.shorten} />
                    <LikeBtn
                        rating_id={rate.id}
                        owner_id={rate.userId}
                        liked={liked}
                        setLiked={setLiked}
                        totalLikes={totalLikes}
                        setTotalLikes={setTotalLikes}
                        type={"rounded"}
                        className={`
                            p-3
                            flex justify-center items-center
                            bg-main-400 border-2 border-main-400 hover:bg-main-500 hover:border-main-500  
                            ${liked ? "text-red-500" : "!text-white"}
                            rounded-full
                            fixed right-4
                            ${scrollDirection > "down" ? "bottom-20" : "bottom-4"}
                            md:bottom-4
                            transition-all duration-300
                            shadow-md
                        `}
                    />
                    <UserRate
                        review={rate}
                        loading={loading}
                        likes={totalLikes}
                    />
                    {tracks.length > 0 ? (
                        <AlbumTracksDisplay
                            tracks={tracks}
                            loading={loading}
                            ratings={rate.ratings}
                            rate={rate}
                        />
                    ) : null}
                    <div className="w-full px-5">
                        <Link
                            href={`/album/${album.id}`}
                            className={`
                                py-3
                                flex justify-center items-center
                                bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600
                                text-white font-semibold rounded-xl
                                w-full
                                max-w-2xl mx-auto
                                cursor-pointer
                                transition-all duration-300
                            `}
                        >
                            Ver álbum
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
