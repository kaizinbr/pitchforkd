"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { RatingCardSkeletonList } from "../Skeletons";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Masonry from "@mui/lab/Masonry";

export default function ArtistAlbuns({ id }: { id: any }) {
    const [albuns, setalbuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState<number>(30);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/artist/${id}/albuns`);
            console.log(response.data);
            setalbuns(response.data.items);
            setTotal(response.data.total);
            setLoading(false);
        };

        fetchData();
    }, []);

    const albunsList = albuns;

    const handleLoadMore = async () => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/artist/${id}/albuns`, {
                params: {
                    offset: offset,
                },
            });
            // console.log(response.data);

            setalbuns((prevAlbuns) => [...prevAlbuns, ...response.data.items]);
            console.log("Albuns", albunsList);

            // if (albunsList && response.data.items) {
            //     albunsList.push(...response.data.items);
            // }
            // return response.data;
        };
        setOffset(offset + 30);

        await fetchData();

        // if (albunsList && data.items) {
        //     albunsList.push(...data.items);
        // }
    };

    return (
        <div className="w-full flex flex-col gap-4 max-w-2xl mt-10 mx-auto">
            {loading ? (
                <RatingCardSkeletonList count={3} />
            ) : albuns.length > 0 ? (
                <>
                    <h2 className="font-semibold flex px-5">Álbuns</h2>
                    <Masonry
                        columns={{ xs: 2, md: 3 }}
                        spacing={2}
                        className={`
                            
                            w-full px-3 !m-0
                        `}
                    >
                        {albuns.map((album) => (
                            <Link
                                href={`/album/${album.id}`}
                                key={album.id}
                                className={`
                                        p-4 flex flex-col items-start
                                        
                                        bg-bunker-800 hover:bg-bunker-700 
                                        rounded-xl transition-all duration-200 cursor-pointer
                                    `}
                            >
                                <Image
                                    src={album.images[1].url}
                                    alt={album.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-auto rounded-lg mb-3"
                                />
                                <div className="flex flex-col">
                                    <p className="text-xs text-gray-500 mb-1">
                                        {(() => {
                                            switch (album.album_type) {
                                                case "album":
                                                    return "Álbum";
                                                case "single":
                                                    return "Single/EP";
                                                case "compilation":
                                                    return "Compilação";
                                                default:
                                                    return "Outro";
                                            }
                                        })()}
                                    </p>
                                    <h3 className="text-sm font-semibold">
                                        {album.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </Masonry>

                    {total > 5 && albuns.length < total && (
                        <button
                            onClick={handleLoadMore}
                            className={`
                                flex justify-center items-center py-2 mx-5 rounded-xl 
                                bg-blue-celestial hover:bg-blue-celestial/80 transition-all duration-200 cursor-pointer 
                                text-white font-bold
                            `}
                        >
                            Carregar mais
                        </button>
                    )}
                </>
            ) : (
                <div className="text-xl font-bold  px-5 mt-10 text-center w-full">
                    <h2 className="">Nenhum álbum ainda</h2>
                </div>
            )}
        </div>
    );
}
