"use client";

import { useState, useEffect } from "react";
import AlbumCover from "@/components/album/album-cover";
import { extractColors } from "extract-colors";
import axios from "axios";
import AlbumData from "./album-data";
import AlbumTracks from "./album-tracks";
import AlbumBtn from "./album-btn";
import {
    generatePleasantGradient,
    reduceAlpha,
    darkenColor,
} from "./gen-gradient";

export default function AlbumMain({ album_id }: { album_id: string | null }) {
    const [album, setAlbum] = useState<any>([]);
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");
    const [colorsArray, setColorsArray] = useState<any[]>([]);
    const [color1, setColor1] = useState<string>("#4a6d73");
    const [color2, setColor2] = useState<string>("#b78972");
    const [color3, setColor3] = useState<string>("#691209");
    const [gradient, setGradient] = useState<string>("");

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
            const response = await axios.get(`/api/spot/album/${album_id}`);
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
                            `/api/spot/album/${album_id}/tracks?offset=${i * 50}`
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
                    setColorsArray(colors);

                    updateColor(colors);
                    const sortedColors = [...colors]
                        .filter((c) => c.lightness <= 0.8)
                        .sort((a, b) => b.intensity - a.intensity);

                    const css = generatePleasantGradient(sortedColors);

                    setColor1(css[0]);
                    setColor2(css[1]);
                    setColor3(css[2]);
                })
                .catch(console.error);
        };

        fetchData();
    }, [album_id]);

    return (
        <>
            <div
                className={`
                                   absolute h-[30rem] w-full -z-50 from-40 
                                   top-0
                                   transition-all duration-200 ease-in-out overflow-hidden
                                   bg-blend-screen
                               `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${darkenColor(color1, 2)}, transparent)`,
                    filter: ` brightness(0.5) contrast(1.2) saturate(1.5)`,
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center blur-3xl">
                    <div
                        style={{ backgroundColor: color1 }}
                        className={`absolute rounded-full bg-[${color1}] size-100 -top-1/3 -left-1/4 blur-3xl`}
                    ></div>
                    <div
                        style={{ backgroundColor: color2 }}
                        className={`absolute rounded-full bg-[${color2}] -right-1/4 -top-1/3 size-80 blur-3xl`}
                    ></div>
                </div>
            </div>
            <AlbumCover album={album} loading={loading} />
            <AlbumData album={album} tracks={tracks} loading={loading} />
            <AlbumBtn album={album} loading={loading} />
            {tracks.length > 0 ? (
                <AlbumTracks tracks={tracks} loading={loading} />
            ) : null}
        </>
    );
}
