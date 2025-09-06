"use client";

import { useState, useEffect } from "react";
import AlbumCover from "@/components/album/album-cover";
import axios from "axios";
// import AlbumData from "./album-data";
// import AlbumTracks from "./album-tracks";
// import AlbumBtn from "./album-btn";
import ColorThief from "colorthief";
import { Vibrant } from "node-vibrant/browser";
// import { Palette } from '@vibrant/color';

import {
    darkenColor,
} from "@/components/album/gen-gradient";

// interface Palette {
//     Vibrant: Swatch;
//     Muted: Swatch;
//     DarkVibrant: Swatch;
//     DarkMuted: Swatch;
//     LightVibrant: Swatch;
//     LightMuted: Swatch;
// }

export default function AlbumMain({ album_id }: { album_id: string | null }) {
    const [album, setAlbum] = useState<any>([]);
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [color1, setColor1] = useState<string>("#4a6d73");
    const [color2, setColor2] = useState<string>("#b78972");
    const [color3, setColor3] = useState<string>("#691209");
    // const [colorsArray, setColorsArray] = useState<{
    //     Vibrant: string;
    //     Muted: string;
    //     DarkVibrant: string;
    //     DarkMuted: string;
    //     LightVibrant: string;
    //     LightMuted: string;
        
    // }>({});
    // const [colors, setColors] = useState<Palette | null>(null);

    const [vibrantColor, setVibrantColor] = useState<string>("#ffffff");
    const [mutedColor, setMutedColor] = useState<string>("#ffffff");
    const [darkVibrantColor, setDarkVibrantColor] = useState<string>("#ffffff");
    const [darkMutedColor, setDarkMutedColor] = useState<string>("#ffffff");
    const [lightVibrantColor, setLightVibrantColor] = useState<string>("#ffffff");
    const [lightMutedColor, setLightMutedColor] = useState<string>("#ffffff");
    const [textColor, setTextColor] = useState<string>("#222");
    

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

            Vibrant.from(response.data.images[0]?.url)
                .getPalette()
                .then((palette) => {
                    console.log(palette);
                    // setColors(palette);
                    if (palette.Vibrant) {
                        const rgb = palette.Vibrant.rgb;
                        setVibrantColor(`rgb(${rgb.join(', ')})`);
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
                        setDarkVibrantColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
                    }
                    if (palette.DarkMuted) {
                        const rgb = palette.DarkMuted.rgb;
                        setDarkMutedColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
                    }   
                    if (palette.LightVibrant) {
                        const rgb = palette.LightVibrant.rgb;
                        setLightVibrantColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
                    }
                    if (palette.LightMuted) {
                        const rgb = palette.LightMuted.rgb;
                        setLightMutedColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
                    }
                });

            setLoading(false);

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
                    backgroundImage: `linear-gradient(to bottom, ${darkVibrantColor}, transparent)`,
                    filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                }}
            >
                <div className="absolute inset-0 max-w-sm m-auto flex items-center justify-center blur-3xl">
                    <div
                        style={{ backgroundColor: vibrantColor }}
                        className={`absolute rounded-full size-80 -top-1/3 -left-1/4 blur-3xl`}
                    ></div>
                    <div
                        style={{ backgroundColor: mutedColor }}
                        className={`absolute rounded-full -right-1/4 -top-1/3 w-80 h-100 blur-3xl`}
                    ></div>
                    <div
                        style={{ backgroundColor: lightVibrantColor }}
                        className={`absolute rounded-full left-0 top-1/3 size-40 blur-3xl`}
                    ></div>
                </div>
            </div>
            <AlbumCover album={album} loading={loading} />
            

            {vibrantColor && (
                <div
                    style={{
                        backgroundColor: vibrantColor,
                    }}
                    className={`rounded-md size-12 text-center flex items-center justify-center`}
                >
                    <span
                        style={{ color: textColor }}
                        className="text-sm"
                    >
                        Aa
                    </span>
                </div>
            )}

            {darkVibrantColor && (
                <div
                    style={{
                        backgroundColor: darkVibrantColor,
                    }}
                    className={`rounded-md size-12 text-center flex items-center justify-center`}
                >
                    <span
                        style={{ color: textColor }}
                        className="text-sm"     
                    >
                        Aa
                    </span>
                </div>
            )}
            {lightVibrantColor && (
                <div
                    style={{
                        backgroundColor: lightVibrantColor,
                    }}
                    className={`rounded-md size-12 text-center flex items-center justify-center`}
                >
                    <span
                        style={{ color: textColor }}
                        className="text-sm"     
                    >
                        Aa
                    </span>
                </div>
            )}

            {mutedColor && (
                <div
                    style={{
                        backgroundColor: mutedColor,
                    }}
                    className={`rounded-md size-12 text-center flex items-center justify-center`}
                >
                    <span

                        style={{ color: textColor }}
                        className="text-sm"     
                    >
                        Aa
                    </span>
                </div>
            )}




            {/* <AlbumData album={album} tracks={tracks} loading={loading} />
            <AlbumBtn album={album} loading={loading} />
            {tracks.length > 0 ? (
                <AlbumTracks tracks={tracks} loading={loading} />
            ) : null} */}
        </>
    );
}
