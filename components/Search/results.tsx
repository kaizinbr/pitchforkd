"use client";

import { Suspense, useState, useEffect } from "react";
import { FloatingIndicator, Tabs } from "@mantine/core";
import classes from "./tabs.module.css";
import { InvoicesMobileSkeleton } from "@/components/Skeletons";
import { TbExplicit } from "react-icons/tb";
import { BsExplicitFill } from "react-icons/bs";
import UserCard from "../ui/UserCard";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Track, Album, User } from "@/lib/utils/types";

import { createClient } from "@/utils/supabase/client";

function Results({
    query,
    currentPage,
    type,
}: {
    query: string;
    currentPage: number;
    type: string;
}) {
    const [invoices, setInvoices] = useState<any>([]);

    const [artistResults, setArtistResults] = useState<
        { id: string; images: [any]; name: string }[]
    >([]);
    const [tracksResults, setTracksResults] = useState<Track[]>([]);
    const [albunsResults, setAlbunsResults] = useState<Album[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            const supabase = createClient();

            if (query == "") {
                console.log("empty");
                setArtistResults([]);
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*");
                if (error) {
                    console.log(error);
                } else {
                    setUsers(data);
                }   
                
            } else if (type === "user") {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .or(`username.ilike.%${query}%, name.ilike.%${query}%`)
                    .order("created_at", { ascending: true });
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                    setUsers(data);
                }
            } else {
                const response = await axios.post("/api/spot/search", {
                    q: query,
                    type: type,
                    page: currentPage,
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
            }
        };

        fetchInvoices();
    }, [query, currentPage, type]);

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full gap-3">
                {type === "album" &&
                    albunsResults.map((album) => (
                        <Link
                            key={album.id}
                            href={`/album/${album.id}`}
                            className="flex flex-row items-center gap-3 p-2 rounded-xl hover:bg-bunker-800 bg-transparent transition-all duration-300"
                        >
                            <Image
                                className="w-10 h-10 rounded-md"
                                src={album.images[2]?.url}
                                alt={album.name}
                                width={40}
                                height={40}
                            />
                            <div className="flex flex-col">
                                <h3 className="text-left font-semibold">
                                    {album.name}
                                </h3>
                                <span className="text-sm text-bunker-300">
                                    {album.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </span>
                            </div>
                        </Link>
                    ))}
                {type === "track" &&
                    tracksResults.map((track) => (
                        <Link
                            key={track.id}
                            className="flex flex-row items-center gap-3 p-2 rounded-xl hover:bg-bunker-800 bg-transparent transition-all duration-300"
                            href={`/album/${track.album.id}`}
                        >
                            <Image
                                className="w-10 h-10 rounded-md"
                                src={track.album.images[2]?.url}
                                alt={track.name}
                                width={40}
                                height={40}
                            />

                            <div className="flex flex-col">
                                <h3 className="text-left font-semibold flex flex-row gap-1 items-center">
                                    {track.explicit ? (
                                        <BsExplicitFill className="text-bunker-500 size-3" />
                                    ) : null}
                                    {track.name}
                                </h3>
                                <span className="text-sm text-bunker-300">
                                    {track.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </span>
                            </div>
                        </Link>
                    ))}
                {type === "artist" &&
                    artistResults.map((artist) => (
                        <Link
                            key={artist.id}
                            className="flex flex-row items-center p-2 rounded-xl hover:bg-bunker-800 bg-transparent transition-all duration-300"
                            href={`/artist/${artist.id}`}
                        >
                            <Image
                                className="w-10 h-10 rounded-full"
                                src={artist.images[0]?.url}
                                alt={artist.name}
                                width={40}
                                height={40}
                            />
                            <p className="ml-3 text-left">{artist.name}</p>
                        </Link>
                    ))}

                {type === "user" &&
                    users.map((user) => (
                        <UserCard
                            key={user.id}
                            data={{
                                avatar_url: user.avatar_url,
                                name: user.name,
                                username: user.username,
                            }}
                        />
                    ))}

                {type === "album" && albunsResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full ">
                        <h1 className="font-bold text-xl text-bunker-300">
                            Nenhum resultado encontrado
                        </h1>
                    </div>
                )}

                {type === "track" && tracksResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full ">
                        <h1 className="font-bold text-xl text-bunker-300">
                            Nenhum resultado encontrado
                        </h1>
                    </div>
                )}

                {/* {type === "artist" && artistResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full ">
                        <h1 className="font-bold text-xl text-bunker-300">
                            Nenhum resultado encontrado
                        </h1>
                    </div>
                )} */}

                {type === "user" && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full ">
                        <h1 className="font-bold text-xl text-bunker-300">
                            Nenhum resultado encontrado
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ResultsPage({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [value, setValue] = useState<string | null>("1");
    const [controlsRefs, setControlsRefs] = useState<
        Record<string, HTMLButtonElement | null>
    >({});
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };

    return (
        <Tabs
            variant="none"
            value={value}
            onChange={setValue}
            className="w-full"
        >
            <Tabs.List
                ref={setRootRef}
                className={`flex flex-row justify-center w-full ${classes.list}`}
            >
                <div className="flex flex-row w-full justify-center">
                    <Tabs.Tab
                        value="1"
                        ref={setControlRef("1")}
                        className={`text-bunker-50 font-semibold relative  ${classes.tab}`}
                    >
                        Álbuns
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="2"
                        ref={setControlRef("2")}
                        className={classes.tab}
                    >
                        Músicas
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="3"
                        ref={setControlRef("3")}
                        className={classes.tab}
                    >
                        Usuários
                    </Tabs.Tab>
                </div>

                <FloatingIndicator
                    target={value ? controlsRefs[value] : null}
                    parent={rootRef}
                    className={`bg-orange-safety rounded-full`}
                />
            </Tabs.List>

            <Tabs.Panel value="1">
                <Suspense
                    key={query + currentPage}
                    fallback={<InvoicesMobileSkeleton />}
                >
                    <h1 className="font-bold text-xl mb-2">Álbuns</h1>
                    <Results
                        query={query}
                        currentPage={currentPage}
                        type="album"
                    />
                </Suspense>
            </Tabs.Panel>
            <Tabs.Panel value="2">
                <Suspense
                    key={query + currentPage}
                    fallback={<InvoicesMobileSkeleton />}
                >
                    <h1 className="font-bold text-xl mb-2">Músicas</h1>
                    <Results
                        query={query}
                        currentPage={currentPage}
                        type="track"
                    />
                </Suspense>
            </Tabs.Panel>
            <Tabs.Panel value="3">
                <Suspense
                    key={query + currentPage}
                    fallback={<InvoicesMobileSkeleton />}
                >
                    <h1 className="font-bold text-xl mb-2">Usuários</h1>
                    <Results
                        query={query}
                        currentPage={currentPage}
                        type="user"
                    />
                </Suspense>
            </Tabs.Panel>
        </Tabs>
    );
}
