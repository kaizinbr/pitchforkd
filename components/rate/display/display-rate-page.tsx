"use client";

import { useEffect, useState } from "react";
import { extractColors } from "extract-colors";
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

export default function DisplayRate({
    id,
    rate,
}: {
    id?: string;
    rate: Review;
}) {
    const supabase = createClient();

    const [album, setAlbum] = useState<any>();
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [canDelete, setCanDelete] = useState(false);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");

    function updateColor(colors: { hex: string; intensity: number }[]) {
        if (setCurrentColor) {
            const maxIntensityColor = colors.reduce((prev, current) => {
                const prevIntensity = prev.intensity;
                const currentIntensity = current.intensity;
                return currentIntensity > prevIntensity ? current : prev;
            });
            setCurrentColor(maxIntensityColor.hex);
            console.log("Color:", maxIntensityColor.hex);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `/api/spot/album/${rate.album_id}`
            );
            console.log(response.data);
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
            extractColors(response.data.images[0]?.url)
                .then((colors) => {
                    updateColor(colors);
                })
                .catch(console.error);
        };

        const fetchUser = async () => {
            const {
                data: { user }, error
            } = await supabase.auth.getUser();
    
            if (!user) {
                console.error("User not logged in");
                return;
            } 

            if (error) {
                console.error(error);
                return;
            }

            console.log(user.id, rate.profiles.id)

            if (user.id === rate.profiles.id) {
                setCanDelete(true);
            }
        }

        fetchData();
        fetchUser();
    }, [id]);

    return (
        <>
            {album && (
                <>
                    <div
                        className={`
                        absolute h-[30rem] w-full -z-50 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                        style={{
                            backgroundImage: `linear-gradient(to bottom, ${currentColor}, transparent)`,
                        }}
                    ></div>
                    <AlbumCover album={album} loading={loading} />
                    <AlbumData
                        album={album}
                        tracks={tracks}
                        loading={loading}
                    />
                    {canDelete ? (
                        <DeleteBtn id={rate.id} />
                    ) : null}
                    <ShareBtn shorten={rate.shorten} />
                    <UserRate album={rate} loading={loading} />
                    {tracks.length > 0 ? (
                        <AlbumTracksDisplay
                            tracks={tracks}
                            loading={loading}
                            ratings={rate.ratings}
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
