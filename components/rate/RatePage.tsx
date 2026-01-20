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
import useColors from "@/lib/utils/getColors";
import { Album } from "@/lib/utils/types";
import CurrentLyrics from "@/components/rate/lyrics";

export default function RatePage({ id }: { id: string }) {
    //album
    const [album, setAlbum] = useState<Album>();
    const [tracks, setTracks] = useState<any[]>([]);
    const [ratings, setRatings] = useState<
        { id: string; value: number; favorite: boolean; comment?: string; skip?: boolean }[]
    >([]);
    const [currentTrack, setCurrentTrack] = useState<string>("");
    const [active, setActive] = useState(0);
    const [album_img, setAlbumImg] = useState<string>("");

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

        const { vibrant, darkVibrant, lightMuted, titleTextColor } = useColors(album_img);


    useEffect(() => {
        const fetchData = async () => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Para evitar problemas de CORS


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
                    <Rater
                        album={album}
                        setCurrentTrack={setCurrentTrack}
                        tracks={tracks}
                        ratings={ratings}
                        setRatings={setRatings}
                        active={active}
                        setActive={setActive}
                    />

                    {/* {currentTrack && (
                        <CurrentLyrics
                            track_id={currentTrack}
                            lightMuted={lightMuted}
                            darkVibrant={darkVibrant}
                            vibrant={vibrant}
                            backgroundColor={darkVibrant}
                            textColor={titleTextColor}
                        />
                    )} */}
                </>
            )}
        </>
    );
}
