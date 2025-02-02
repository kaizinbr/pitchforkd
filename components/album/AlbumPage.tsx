"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function AlbumPage({ id }: { id: string }) {
    const [album, setAlbum] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/album/${id}`);
            console.log(response.data);
            setAlbum(response.data);
        };

        fetchData();
    }, [id]);

    return (
        <div>
            Album Page
            <div>Album ID: {id}</div>
            <Link href={`/album/${id}/rate`}>Avaliar álbum</Link>
            {album && (
                <div>
                    <div>Nome: {album.name}</div>
                    <div>Artista: {album.artists[0].name}</div>
                    <div>
                        Imagem:{" "}
                        <Image
                            src={album.images[0].url}
                            alt={album.name}
                            width={100}
                            height={100}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
