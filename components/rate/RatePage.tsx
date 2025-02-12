"use client";

import { useEffect, useState } from "react";
import { extractColors } from "extract-colors";
import axios from "axios";
import Rater from "./Rater";
import AlbumCover from "../album/album-cover";

export default function RatePage({ id }: { id: string }) {
    const [album, setAlbum] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");

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
            const response = await axios.get(`/api/spot/album/${id}`);
            console.log(response.data);
            setAlbum(response.data);
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
            {album && (
                <>
                    <div
                        className={`
                        absolute h-[30rem] w-lvw -z-50 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                        style={{
                            backgroundImage: `linear-gradient(to bottom, ${currentColor}, transparent)`,
                        }}
                    ></div>
                    <AlbumCover album={album} loading={loading} />
                    <div className="flex flex-col px-5 mb-6">
                        <h2 className="font-bold">
                            Você está avaliando {album.name}
                        </h2>
                        <p className="font-semibold">
                            Por{" "}
                            {album.artists.map((artist: any, index: number) => (
                                <span key={artist.id}>
                                    {artist.name}
                                    {index < album.artists.length - 1 && ", "}
                                </span>
                            ))}
                        </p>
                    </div>
                    <Rater tracks={album.tracks.items} albumId={album.id} />
                </>
            )}
        </>
    );
}
