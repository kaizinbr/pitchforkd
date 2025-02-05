"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Rater from "./Rater";
import AlbumCover from "../album/album-cover";

export default function RatePage({ id }: { id: string }) {
    const [album, setAlbum] = useState<any>();
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/album/${id}`);
            setAlbum(response.data);
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
                    <AlbumCover album={album} loading={false} />
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
