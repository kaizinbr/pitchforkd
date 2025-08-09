"use client";

import { useEffect, useState } from "react";
import { extractColors } from "extract-colors";
import axios from "axios";
import Rater from "./Rater";
import AlbumCover from "../album/album-cover";
import { Album } from "@/lib/utils/types";
import CurrentLyrics from "@/components/rate/lyrics";

export default function RatePage({ id }: { id: string }) {
    const [album, setAlbum] = useState<Album>();
    const [currentTrack, setCurrentTrack] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");
    
    // function updateColor(colors: { hex: string; intensity: number }[]) {
    //     if (setCurrentColor) {
    //         const maxIntensityColor = colors.reduce((prev, current) => {
    //             const prevIntensity = prev.intensity;
    //             const currentIntensity = current.intensity;
    //             return currentIntensity > prevIntensity ? current : prev;
    //         });
    //         setCurrentColor(maxIntensityColor.hex);
    //         console.log("Color:", maxIntensityColor.hex);
    //     }
    // }

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/album/${id}`);
            console.log(response.data);
            setAlbum(response.data);
            setLoading(false);
        //     extractColors(response.data.images[0]?.url)
        //         .then((colors) => {
        //             updateColor(colors);
        //         })
        //         .catch(console.error);
        };

        fetchData();
    }, []);

    return (
        <>
            {album && (
                <>
                    <div className="flex flex-col w-full max-w-2xl mt-8">
                        <h2>
                            Você está avaliando <span  className="font-semibold">{album.name}</span>
                        </h2>
                        <p >
                            Por{" "}
                            {album.artists.map((artist: any, index: number) => (
                                <span key={artist.id} className="font-medium">
                                    {artist.name}
                                    {index < album.artists.length - 1 && ", "}
                                </span>
                            ))}
                        </p>
                    </div>
                    <Rater album={album} setCurrentTrack={setCurrentTrack} />

                    {currentTrack && (
                        <CurrentLyrics track_id={currentTrack} album_img={album.images[0]?.url} />
                    )}
                </>
            )}
        </>
    );
}
