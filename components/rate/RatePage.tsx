"use client";

import { useEffect, useState } from "react";
import ColorThief from "colorthief";
import {
    darkenColor,
    getTextColor,
    getMostSaturatedColor,
} from "@/components/album/gen-gradient";
import axios from "axios";
import Rater from "./Rater";
import AlbumCover from "../album/album-cover";
import { Album } from "@/lib/utils/types";
import CurrentLyrics from "@/components/rate/lyrics";

export default function RatePage({ id }: { id: string }) {
    //album
    const [album, setAlbum] = useState<Album>();
    const [tracks, setTracks] = useState<any[]>([]);
    const [ratings, setRatings] = useState<
        { id: string; value: number; favorite: boolean; comment?: string }[]
    >([]);
    const [currentTrack, setCurrentTrack] = useState<string>("");
    const [active, setActive] = useState(0);
    const [album_img, setAlbumImg] = useState<string>("");

    // const [showLyrics, setShowLyrics] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/album/${id}`);
            console.log(response.data);
            setAlbum(response.data);
            if (response.data.images && response.data.images.length > 0) {
                setAlbumImg(response.data.images[0].url);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const [color1, setColor1] = useState<string>("#4a6d73");
    const [color2, setColor2] = useState<string>("#b78972");
    const [color3, setColor3] = useState<string>("#691209");
    const [textColor, setTextColor] = useState<string>("#ffffff");

    useEffect(() => {
        const fetchData = async () => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    // Agora pode usar o elemento img carregado
                    const dominantColor = colorThief.getColor(img);
                    const palette = colorThief.getPalette(img); // 3 cores
                    const mostSaturatedColor = getMostSaturatedColor(palette);

                    console.log("Dominant Color:", dominantColor);
                    console.log("Palette:", palette);
                    console.log("Most Saturated Color:", mostSaturatedColor);

                    setColor1(mostSaturatedColor ?? "#4a6d73");
                    setColor2(
                        `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
                    );
                    setColor3(
                        `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`
                    );

                    const textColor = getTextColor(color1);
                    console.log("Text Color:", textColor);
                    setTextColor(textColor);
                } catch (error) {
                    console.error("Erro ao extrair cores:", error);
                }
            };

            img.onerror = () => {
                console.error("Erro ao carregar a imagem");
            };
            img.src = album_img;
        };

        fetchData();
    }, [album_img]);

    return (
        <>
            {album && (
                <>
                    <div
                        className={`
                            flex flex-row w-full
                            justify-between
                            fixed top-0 left-0 right-0 z-10
                            p-4 bg-malachite-900/70 
                            backdrop-blur-md
                        `}
                        style={{
                            backgroundColor: color1,
                            color: textColor,
                        }}
                    >
                        <div className="flex flex-col w-6/10 max-w-2xl m-auto">
                            <h2 className="font-semibold line-clamp-1">{album.name}</h2>
                            <p className="text-xs text-neutral-300">
                                {album.artists.map(
                                    (artist: any, index: number) => (
                                        <span
                                            key={artist.id}
                                            className="font-medium"
                                        >
                                            {artist.name}
                                            {index < album.artists.length - 1 &&
                                                ", "}
                                        </span>
                                    )
                                )}
                            </p>
                        </div>
                        <button className="bg-main-500 hover:bg-main-600 transition-all duration-300 rounded-lg cursor-pointer px-4 py-2 text-sm">
                            Salvar rascunho
                        </button>
                    </div>
                    <Rater
                        album={album}
                        setCurrentTrack={setCurrentTrack}
                        tracks={tracks}
                        ratings={ratings}
                        setRatings={setRatings}
                        active={active}
                        setActive={setActive}
                    />

                    {currentTrack && (
                        <CurrentLyrics
                            track_id={currentTrack}
                            album_img={album.images[0]?.url}
                        />
                    )}
                </>
            )}
        </>
    );
}
