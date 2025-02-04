"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { extractColors } from "extract-colors";
import axios from "axios";

export default function AlbumCover({
    album_id,
}: {
    album_id: string | null;
}) {
    const [album, setAlbum] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#F17105");

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
            // console.log(response.data);
            setAlbum(response.data);
            setLoading(false);
            extractColors(response.data.images[0]?.url)
                .then((colors) => {
                    updateColor(colors);
                })
                .catch(console.error);
        };

        fetchData();
    }, [album_id]);

    // console.log("Avatar src:", avatarSrc);

    return (
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
            <div className="w-full mt-16 flex justify-center items-center">
                {loading ? (
                    <div className="size-64 rounded-xl bg-neutral-500"></div>
                ) : album ? (
                    <picture>
                        <Image
                            src={album.images[0]?.url}
                            alt={album.name}
                            width={256}
                            height={256}
                            className="rounded-xl size-64"
                        />
                    </picture>
                ) : (
                    <div>No album</div>
                )}
            </div>
        </>
    );
}
