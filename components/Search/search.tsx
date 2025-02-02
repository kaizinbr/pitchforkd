"use client";
import { useRef, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

function debounce(callback: () => void, delay: number) {
    let timeoutId: NodeJS.Timeout;

    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, delay);
    };
}

export default function Search() {
    const [title, setTitle] = useState("Naked In Manhattan");
    const [coverUrl, setCoverUrl] = useState(
        "https://i.scdn.co/image/ab67616d0000b27396fa88fb1789be437d5cb4b6"
    );
    const [artist, setArtist] = useState("Chappell Roan");
    const [lyrics, setLyrics] = useState(
        "Touch me, baby (Touch me, touch me, touch me, touch me)\nTouch me, baby (Naked in Manhattan)\nTouch me, baby (Touch me, touch me, touch me, touch me)\nTouch me, baby (Naked in Manhattan)"
    );
    const [colors, setColors] = useState<string[]>([
        "#011313",
        "#fcf9e0",
        "#c8be9a",
        "#a67041",
    ]);

    const [query, setQuery] = useState("");
    const [artistResults, setArtistResults] = useState<
        { id: string; images: [any]; name: string }[]
    >([]);
    const [tracksResults, setTracksResults] = useState<
        {
            id: string;
            album: { images: [any] };
            artists: [{ name: string }];
            name: string;
        }[]
    >([]);
    const [albunsResults, setAlbunsResults] = useState<
        { id: string; images: [any]; name: string }[]
    >([]);
    const [selected, setSelected] = useState<
        { id: string; image: string; name: string; type: string }[]
    >([]);

    const type = "album%2Ctrack%2Cartist";

    function handleQuery(e: { target: { value: any } }) {
        setSelected([]);
        const currentValue = e.target.value;
        setQuery(currentValue);
        if (currentValue == "") {
            console.log("empty");
            setArtistResults([]);
        } else {
            debounce(async () => {
                try {
                    const response = await axios.post("/api/spot/track", {
                        search: currentValue,
                        type,
                    });
                    const data = response.data;
                    console.log(data);
                    if (data.artists) {
                        setArtistResults(data.artists.items);
                    }
                    if (data.tracks) {
                        setTracksResults(data.tracks.items);
                    }
                    if (data.albums) {
                        setAlbunsResults(data.albums.items);
                    }
                } catch (error) {
                    console.error(error);
                }
            }, 500)();
        }
    }

    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-700/60">
            <h1 className="mb-2 text-xl font-bold">Pesquise do Spotify</h1>
            <label className="flex flex-col font-bold text-base">
                {/* <span className="mb-2">Selecione o artista</span> */}
                <input
                    className="text-base font-medium  border border-transparent focus:border-deluge-600 px-3 py-2 mb-3 outline-none bg-neutral-800 focus:bg-neutral-700 rounded-lg transition duration-300"
                    value={query}
                    type="text"
                    onChange={handleQuery}
                    placeholder="Digite o nome do artista, álbum ou música"
                />
            </label>
            <div className="flex flex-col w-full text-left">
                {/* {tracksResults.length > 0 && (
                    <div className="flex flex-col w-full mb-6">
                        <h3 className="text-lg font-bold">Músicas</h3>
                        {tracksResults.map((track) => (
                            <button
                                key={track.id}
                                className="flex flex-row items-center p-2 rounded-lg hover:bg-neutral-600 bg-transparent transition-all duration-300"
                                onClick={() => {
                                    setCoverUrl(track.album.images[0]?.url);
                                    setArtistResults([]);
                                    setTracksResults([]);
                                    setAlbunsResults([]);
                                    setQuery("");
                                    setSelected([
                                        {
                                            id: track.id,
                                            image: track.album.images[0]?.url,
                                            name: track.name,
                                            type: "Música",
                                        },
                                    ]);
                                    if (type === "album%2Ctrack%2Cartist") {
                                        setTitle(track.name);
                                        setArtist(track.artists[0].name);
                                    }
                                }}
                            >
                                <Image
                                    className="w-10 h-10 rounded-md"
                                    src={track.album.images[0]?.url}
                                    alt={track.name}
                                    width={40}
                                    height={40}
                                />
                                <p className="ml-3 text-left">{track.name}</p>
                            </button>
                        ))}
                    </div>
                )} */}
                {albunsResults.length > 0 && (
                    <div className="flex flex-col w-full mb-6">
                        <h3 className="text-lg font-bold">Álbuns</h3>
                        {albunsResults.map((album) => (
                            <Link
                                key={album.id}
                                href={`/album/${album.id}`}
                                className="flex flex-row items-center p-2 rounded-lg hover:bg-neutral-600 bg-transparent transition-all duration-300"
                            >
                                <Image
                                    className="w-10 h-10 rounded-md"
                                    src={album.images[0]?.url}
                                    alt={album.name}
                                    width={40}
                                    height={40}
                                />
                                <p className="ml-3 text-left">{album.name}</p>
                            </Link>
                        ))}
                    </div>
                )}
                {artistResults.length > 0 && (
                    <div className="flex flex-col w-full">
                        <h3 className="text-lg font-bold">Artistas</h3>
                        {artistResults.map((artist) => (
                            <button
                                key={artist.id}
                                className="flex flex-row items-center p-2 rounded-lg hover:bg-neutral-600 bg-transparent transition-all duration-300"
                                onClick={() => {
                                    setCoverUrl(artist.images[0]?.url);
                                    setArtistResults([]);
                                    setTracksResults([]);
                                    setAlbunsResults([]);
                                    setQuery("");
                                    setSelected([
                                        {
                                            id: artist.id,
                                            image: artist.images[0]?.url,
                                            name: artist.name,
                                            type: "Artista",
                                        },
                                    ]);
                                }}
                            >
                                <Image
                                    className="w-10 h-10 rounded-full"
                                    src={artist.images[0]?.url}
                                    alt={artist.name}
                                    width={40}
                                    height={40}
                                />
                                <p className="ml-3 text-left">{artist.name}</p>
                            </button>
                        ))}
                    </div>
                )}
                {selected[0] && (
                    <div className="flex flex-row items-center p-2 rounded-lg bg-neutral-600 bg-transparent transition-all duration-300">
                        <Image
                            className={`
                                    w-10 h-10 rounded-full
                                    ${
                                        selected[0].type === "Música"
                                            ? "rounded-md"
                                            : "rounded-full"
                                    }
                                `}
                            src={selected[0].image}
                            alt={selected[0].name}
                            width={40}
                            height={40}
                        />
                        <div className="flex flex-col h-full">
                            <span className="ml-3 text-left">
                                {selected[0].name}
                            </span>
                            <span className="ml-3 text-left text-xs text-neutral-400">
                                {selected[0].type}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
