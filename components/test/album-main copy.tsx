"use client";

import { useState, useEffect } from "react";
import AlbumCover from "@/components/album/album-cover";
import { extractColors } from "extract-colors";
import axios from "axios";
import AlbumData from "@/components/album/album-data";
import AlbumTracks from "@/components/album/album-tracks";
import AlbumBtn from "@/components/album/album-btn";

export default function AlbumMain({ album_id }: { album_id: string | null }) {
    const [album, setAlbum] = useState<any>([]);
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");

    const [colorsArray, setColorsArray] = useState<any[]>([]);
    const [gradient, setGradient] = useState<string>("");

    function hexToRgba(hex: string, alpha = 1) {
        const bigint = parseInt(hex.replace("#", ""), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // no firefox, o extractColors funciona mas pode crashar na hora de pegar a cor de algumas fotos por motivos que eu desconheço
    // aparentemente funcionar normal nos demais navegadores
    // o erro é Uncaught DOMException: The operation is insecure.
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
            extractColors("https://i.scdn.co/image/ab67616d0000b2730a622d619b7d429e350e3003")
                .then((colors) => {
                    setColorsArray(colors);
                    console.log("Extracted colors:", colorsArray);
                    updateColor(colors);

                    if (colors.length < 2) return;

                    const sortedColors = [...colors]
                        .filter((c) => c.lightness <= 0.8)
                        .sort((a, b) => b.area - a.area);
                    console.log("Sorted colors:", sortedColors);
                    const [c1, c2, c3] = sortedColors.slice(0, 3).map((c) => hexToRgba(c.hex, 1));

                    // Exemplo de gradiente fluido estilo Apple Music
                    const g = `
                        radial-gradient(at top left, ${c1}, transparent 70%),
                        radial-gradient(at bottom right, ${c2}, transparent 80%),
                        linear-gradient(135deg, ${c1}, ${c2})
                        `;
                    setGradient(g);
                })
                .catch(console.error);
        };

        fetchData();
    }, [album_id]);

    return (
        <>
            <div
                className={`
                        w-full
                        flex flex-col
                        transition-all duration-200 ease-in-out pb-4
                    `}
                style={{
                    backgroundImage: gradient,
                    backgroundSize: "cover",
                    // backgroundBlendMode: "screen",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    transition: "background-image 0.8s ease-in-out",
                    // "radial-gradient(ellipse at top left, rgba(39,45,131,0.8) 0%, rgba(99,148,180,0.3) 50%, rgba(0,0,0,0) 100%)",
                    // radial-gradient(ellipse at top left, rgba(39,45,131,0.8), rgba(99,148,180,0.3), rgba(0,0,0,0))
                    // backgroundImage: `radial-gradient(ellipse at top left, #272d83, #6394b4), linear-gradient(to bottom, #272d83, transparent)`,
                }}

                //                 setGradient(`
                //   radial-gradient(circle at top left, ${rgba1}, ${rgba2}, ${transparent}),
                //   linear-gradient(to bottom, ${rgba1}, ${transparent})
                // `)
            >
                {/* <div className="absolute rounded-full bg-[#272d83] size-60 -top-1/3 -left-1/4 blur-2xl"></div>
                <div className="absolute rounded-full bg-[#ae7c65] right-0 top-20 size-22 blur-xl"></div>
                <div className="absolute rounded-full bg-[#6394b4] left-20 top-40 size-22 blur-xl"></div> */}
            <AlbumCover album={album} loading={loading} />
            <AlbumData album={album} tracks={tracks} loading={loading} />
            </div>
            <AlbumBtn album={album} loading={loading} />
            {tracks.length > 0 ? (
                <AlbumTracks tracks={tracks} loading={loading} />
            ) : null}

            <button
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
                onClick={() => console.log(colorsArray)}
            >
                Log colorsArray
            </button>

            {colorsArray.length > 0 && (
                <div className="flex flex-col flex-wrap gap-2 mt-4">
                    {colorsArray.map((color, index) => (
                        <div
                            key={index}
                            className="size-40 flex flex-col items-center justify-center rounded-lg shadow-md"
                            style={{ backgroundColor: color.hex }}
                        >
                            <span className="text-white text-xs">
                                {color.hex}
                            </span>
                            <span className="text-white text-xs">
                                area: {color.area * 100}%
                            </span>
                            <span className="text-white text-xs">
                                intensidade: {color.intensity * 100}%
                            </span>
                            <span className="text-white text-xs">
                                claridade: {color.lightness * 100}%
                            </span>
                        </div>
                    ))}
                </div>
            )}

        </>
    );
}
