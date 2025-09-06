"use client";

import { Suspense, useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Masonry from "@mui/lab/Masonry";
import { Skeleton } from "@mantine/core";

export default function ReleasesPage() {
    const [loading, setLoading] = useState(true);
    const [releases, setReleases] = useState([]);

    useEffect(() => {
        const fetchReleases = async () => {
            const response = await axios.get("/api/spot/releases");
            setReleases(response.data.albums.items);
            setLoading(false);
        };

        fetchReleases();
    }, []);

    return (
        <>
            <h1 className="text-xl font-bold mb-4">Lançamentos Recentes</h1>
            {loading ? (
                <Masonry
                    columns={{ xs: 2, md: 3 }}
                    spacing={2}
                    className={`
                    
                        w-full !m-0
                    `}
                >
                    <div
                        className={`
                                p-4 flex flex-col items-start
                                bg-shark-800 rounded-xl 
                            `}
                    >
                        <Skeleton
                            height={"auto"}
                            radius="md"
                            className="!bg-shark-800 aspect-square mb-3"
                        />

                        <Skeleton
                            height={6}
                            radius="xl"
                            width="20%"
                            className="mb-2"
                        />
                        <Skeleton height={11} radius="xl" className="mb-2" />
                        <Skeleton height={11} radius="xl" width="60%" />
                    </div>
                    <div
                        className={`
                                p-4 flex flex-col items-start
                                bg-shark-800 rounded-xl 
                            `}
                    >
                        <Skeleton
                            height={"auto"}
                            radius="md"
                            className="!bg-shark-800 aspect-square mb-3"
                        />

                        <Skeleton
                            height={6}
                            radius="xl"
                            width="20%"
                            className="mb-2"
                        />
                        <Skeleton height={11} radius="xl" width="60%" />
                    </div>
                    <div
                        className={`
                                p-4 flex flex-col items-start
                                bg-shark-800 rounded-xl 
                            `}
                    >
                        <Skeleton
                            height={"auto"}
                            radius="md"
                            className="!bg-shark-800 aspect-square mb-3"
                        />

                        <Skeleton
                            height={6}
                            radius="xl"
                            width="20%"
                            className="mb-2"
                        />
                        <Skeleton height={11} radius="xl" width="60%" />
                    </div>
                    <div
                        className={`
                                p-4 flex flex-col items-start
                                bg-shark-800 rounded-xl 
                            `}
                    >
                        <Skeleton
                            height={"auto"}
                            radius="md"
                            className="!bg-shark-800 aspect-square mb-3"
                        />

                        <Skeleton
                            height={6}
                            radius="xl"
                            width="20%"
                            className="mb-2"
                        />
                        <Skeleton height={11} radius="xl" className="mb-2" />
                        <Skeleton height={11} radius="xl" width="60%" />
                    </div>
                </Masonry>
            ) : releases.length > 0 ? (
                <>
                    <Masonry
                        columns={{ xs: 2, md: 3 }}
                        spacing={2}
                        className={`
                            
                            w-full !m-0
                        `}
                    >
                        {releases.map((album: any) => (
                            <Link
                                href={`/album/${album.id}`}
                                key={album.id}
                                className={`
                                        p-4 flex flex-col items-start
                                        
                                        bg-shark-800 hover:bg-shark-700 
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

                </>
            ) : (
                <div className="text-xl font-bold  px-5 mt-10 text-center w-full">
                    <h2 className="">Nenhum álbum ainda</h2>
                </div>
            )}
        </>
    );
}