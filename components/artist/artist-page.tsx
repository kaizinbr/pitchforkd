"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { extractColors } from "extract-colors";
import Image from "next/image";
import ArtistImage from "@/components/artist/artist-image";
import ArtistAlbuns from "@/components/artist/artist-albuns";

export default function ArtistPage({ id }: { id: string }) {
    const [artist, setArtist] = useState<any>();
    const [loading, setLoading] = useState(true);
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
            const response = await axios.get(`/api/spot/artist/${id}`);
            console.log(response.data);
            setArtist(response.data);

            setLoading(false);
            extractColors(response.data.images[0]?.url)
                .then((colors) => {
                    updateColor(colors);
                })
                .catch(console.error);
        };

        fetchData();
    }, [id]);

    return (
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
            <ArtistImage artist={artist} loading={loading} />
            <div className="w-full max-w-2xl px-5 mx-auto">
                <h1 className="text-2xl font-bold flex mb-3">
                    {loading ? "Carregando..." : artist?.name}
                </h1>
                {loading ? null : (
                    <div className="flex flex-col mb-3">
                        <p className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-bunker-400">
                                Popularidade: {artist?.popularity}
                            </span>
                            <span className="text-sm font-medium text-bunker-400">
                                Seguidores:{" "}
                                {artist?.followers.total.toLocaleString()}
                            </span>
                        </p>
                    </div>
                )}

            </div>
                <ArtistAlbuns id={id} />
        </>
    );
}
