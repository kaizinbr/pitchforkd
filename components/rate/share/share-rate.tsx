"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { extractColors } from "extract-colors";
import axios from "axios";
import { toPng, getFontEmbedCSS } from "html-to-image";
import { AlbumRate, Review } from "@/lib/utils/types";
import Card from "./card";
import CopyText from "./copy-text";

export default function ShareRate({ id, rate }: { id?: string; rate: Review }) {
    const [album, setAlbum] = useState<any>();
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");
    const [colors, setColors] = useState<{ hex: string; intensity: number }[]>(
        []
    );

    function updateColor(colors: { hex: string; intensity: number }[]) {
        setColors(colors);
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

    const ref = useRef<HTMLDivElement>(null);

    const onButtonClick = useCallback(async () => {
        if (ref.current === null) {
            console.error("Ref is null");
            return;
        }
        const fontEmbedCSS = await getFontEmbedCSS(ref.current);

        toPng(ref.current, {
            canvasWidth: 1080,
            canvasHeight: 1920,
            cacheBust: true,
            pixelRatio: 2,
            quality: 1,
        })
            .then((dataUrl) => {
                const link = document.createElement("a");
                const date = new Date().toISOString().replace(/[:.]/g, "-");
                link.download = `rating-${rate.shorten}-${date}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

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
                    console.log(colors);
                    updateColor(colors);
                })
                .catch(console.error);
        };

        fetchData();
    }, [id]);

    return (
        <>
            {album && (
                <>
                    <div
                        className={`
                            rounded-xl overflow-hidden
                            aspect-[9/16] w-8/12 mx-auto
                            max-w-[285px]
                        `}
                    >
                        <div
                            className={`
                            transition-all duration-500 text-white
                            bg-black
                            shadow-lg aspect-[9/16] w-full
                            relative overflow-hidden
                            flex flex-col items-center justify-center px-8
                        `}
                            ref={ref}
                        >
                            <Card
                                currentColor={currentColor}
                                album={album}
                                review={rate}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 w-full max-w-2xl justify-center">
                        {colors.length > 0 &&
                            colors.map((color, index) => (
                                <button
                                    key={index}
                                    className={`
                                    size-8 rounded-xl
                                    bg-[${color.hex}] cursor-pointer
                                `}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => setCurrentColor(color.hex)}
                                ></button>
                            ))}
                    </div>
                    <button
                        className={`
                            py-2 cursor-pointer
                            flex justify-center items-center
                            bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600 
                            text-white !font-semibold rounded-xl
                            max-w-[285px] mx-auto w-full
                            transition-all duration-300
                        `}
                        onClick={async () => {
                            await onButtonClick();
                        }}
                    >
                        Baixar
                    </button>
                    <CopyText rate={rate} album={album} />
                </>
            )}
        </>
    );
}
