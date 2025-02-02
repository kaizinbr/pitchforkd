"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Rater from "./Rater";

export default function RatePage({ id }: { id: string }) {
    const [album, setAlbum] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/album/${id}`);
            setAlbum(response.data);
        };

        fetchData();
    }, [id]);

    return (
        <div>
            {album && (
                <div>
                    <picture>
                        <Image
                            src={album.images[0].url}
                            alt={album.name}
                            width={400}
                            height={400}
                        />
                    </picture>
                    <div>Avaliando {album.name}</div>
                    <div>Por {album.artists[0].name}</div>
                    <Rater tracks={album.tracks.items} albumId={album.id} />
                </div>
            )}
        </div>
    );
}
