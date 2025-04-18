import { useState, useEffect } from "react";
import { ScrollArea } from "@mantine/core";

import axios from "axios";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

export default function Search({ data, setData }: { data: any; setData: any }) {
    const [results, setResults] = useState<
        {
            id: string;
            name: string;
            artists: { name: string }[];
            images: { url: string }[];
        }[]
    >([]);

    const handleSearch = useDebouncedCallback(async (value: string) => {
        console.log(`Searching... ${value}`);

        if (value === "") {
            setResults([]);
            return;
        }

        await axios
            .post("/api/spot/album", {
                q: value,
            })
            .then((res) => {
                console.log(res.data);
                setResults(res.data.albums.items);
            });
    }, 300);

    return (
        <div className="flex flex-col w-full">
            <input
                className={`
                    peer block w-full rounded-xl bg-bunker-700 border border-bunker-700
                    px-3 py-2 text-sm outline-2 placeholder:text-bunker-500 outline-none
                `}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
            />

            <ScrollArea h={250} className="flex flex-col w-full gap-3 mt-3">
                {results.length > 0 ? (
                    results.map((album) => (
                        <button
                            type="button"
                            key={album.id}
                            className="cursor-pointer flex flex-row items-center gap-3 p-2 rounded-xl hover:bg-bunker-800 bg-transparent transition-all duration-300 w-full"
                            onClick={() => {
                                // console.log(album);
                                if (data.length < 10 && !data.some((item: any) => item.id === album.id)) {
                                    setData([
                                        ...data,
                                        {
                                            id: album.id,
                                            src: album.images[2]?.url,
                                            title: album.name,
                                            artist: album.artists
                                                .map((artist) => artist.name)
                                                .join(", "),
                                        },
                                    ]);
                                    setResults([]);
                                }
                            }}
                        >
                            <Image
                                className="w-10 h-10 rounded-md"
                                src={album.images[2]?.url}
                                alt={album.name}
                                width={40}
                                height={40}
                            />
                            <div className="text-left flex flex-col">
                                <h3 className="font-semibold">{album.name}</h3>
                                <span className="text-sm text-bunker-300">
                                    {album.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </span>
                            </div>
                        </button>
                    ))
                ) : (
                    <p className="text-bunker-300 text-center">
                        Os resultados aparecerão aqui...
                    </p>
                )}
            </ScrollArea>
        </div>
    );
}
