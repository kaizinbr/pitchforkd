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
            .post("/api/spot/artist", {
                q: value,
            })
            .then((res) => {
                console.log(res.data);
                setResults(res.data.artists.items);
            });
    }, 300);

    return (
        <div className="flex flex-col w-full">
            <input
                className={`
                    peer block w-full rounded-xl bg-shark-700 border border-shark-700
                    px-3 py-2 text-sm outline-2 placeholder:text-shark-500 outline-none
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
                            className="cursor-pointer flex flex-row items-center gap-3 p-2 rounded-xl hover:bg-shark-800 bg-transparent transition-all duration-300 w-full"
                            onClick={() => {
                                // console.log(album);
                                if (data.length < 10 && !data.some((item: any) => item.id === album.id)) {
                                    setData([
                                        ...data,
                                        {
                                            id: album.id,
                                            src: album.images[2]?.url,
                                            name: album.name,
                                        },
                                    ]);
                                    setResults([]);
                                }
                            }}
                        >
                            <Image
                                className="size-10 rounded-full"
                                src={album.images[2]?.url || "/placeholder.webp"}
                                alt={album.name}
                                width={40}
                                height={40}
                            />
                            <div className="text-left flex flex-col">
                                <h3 className="font-semibold">{album.name}</h3>
                            </div>
                        </button>
                    ))
                ) : (
                    <p className="text-shark-300 text-center">
                        Os resultados aparecerão aqui...
                    </p>
                )}
            </ScrollArea>
        </div>
    );
}
