"use client";

import { useEffect, useState } from "react";
import { extractColors } from "extract-colors";
import axios from "axios";
import AlbumCover from "@/components/album/album-cover";
import AlbumData from "@/components/album/album-data";
import { AlbumRate, Profile } from "@/lib/utils/types";
import UserRate from "./user-rate";
import AlbumTracksDisplay from "./display-tracks";

export default function DisplayRate({ id, user, rate }: { id: string; user: Profile; rate: AlbumRate }) {
    const [album, setAlbum] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");

    console.log("User:", user);
    console.log("Album data:", rate);

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
                    <AlbumData album={album} loading={loading} />
                    <UserRate album={rate} user={user} loading={loading} />
                    <AlbumTracksDisplay album={album} loading={loading} ratings={rate.ratings}/>
                </>
            )}
        </>
    );
}
