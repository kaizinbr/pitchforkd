"use client";

import { Suspense, useState, useEffect } from "react";
import { BsExplicitFill } from "react-icons/bs";
import UserCard from "../ui/UserCard";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Track, Album, User } from "@/lib/utils/types";
import { createClient } from "@/utils/supabase/client";

import { Skeleton } from "@mantine/core";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

 

export default function ResultsPage({
    query,
    tab,
}: {
    query: string;
    tab: string;
}) {
    const supabase = createClient();
    const [invoices, setInvoices] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const [artistResults, setArtistResults] = useState<
        { id: string; images: [any]; name: string }[]
    >([]);
    const [tracksResults, setTracksResults] = useState<Track[]>([]);
    const [albunsResults, setAlbunsResults] = useState<Album[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            if (query == "") {
                console.log("empty");
                setArtistResults([]);
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("public", true)
                    .order("created_at", { ascending: false });
                if (error) {
                    console.log(error);
                } else {
                    setUsers(data);
                }
                setLoading(false);
            } else if (tab === "profiles") {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .or(`username.ilike.%${query}%, name.ilike.%${query}%`)
                    .eq("public", true)
                    .order("created_at", { ascending: true });
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                    setUsers(data);
                }
                setLoading(false);
            } else {
                const response = await axios.post("/api/spot/search", {
                    q: query,
                    type: tab,
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
                setLoading(false);
            }
        };
        fetchInvoices();
    }, [query, tab]);

    return (
        <div className="flex flex-col w-full px-4 mt-29 md:mt-32 gap-6">
            <div className="flex flex-col w-full gap-3">
                {tab === "albums" &&
                    albunsResults.map((album) => (
                        <Link
                            key={album.id}
                            href={`/album/${album.id}`}
                            className="flex flex-row items-center gap-3 p-2 rounded-xl hover:bg-shark-800 bg-transparent transition-all duration-300"
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
                                <span className="text-sm text-shark-300">
                                    {album.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </span>
                            </div>
                        </Link>
                    ))}

                {tab === "tracks" &&
                    tracksResults.map((track) => (
                        <Link
                            key={track.id}
                            className="flex flex-row items-center gap-3 p-2 rounded-xl hover:bg-shark-800 bg-transparent transition-all duration-300"
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
                                        <BsExplicitFill className="text-shark-500 size-3" />
                                    ) : null}
                                    {track.name}
                                </h3>
                                <span className="text-sm text-shark-300">
                                    {track.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </span>
                            </div>
                        </Link>
                    ))}
                {tab === "artists" &&
                    artistResults.map((artist) => (
                        <Link
                            key={artist.id}
                            className="flex flex-row items-center p-2 rounded-xl hover:bg-shark-800 bg-transparent transition-all duration-300"
                            href={`/artist/${artist.id}`}
                        >
                            <Image
                                className="w-10 h-10 rounded-full"
                                src={artist.images[0]?.url}
                                alt={artist.name}
                                width={40}
                                height={40}
                            />
                            <p className="ml-3 text-left  font-semibold">
                                {artist.name}
                            </p>
                        </Link>
                    ))}

                {tab === "profiles" &&
                    users.map((user) => (
                        <UserCard
                            key={user.id}
                            data={{
                                avatar_url: user.avatar_url,
                                name: user.name,
                                username: user.username,
                                verified: user.verified,
                            }}
                        />
                    ))}

                {tab === "albums" && albunsResults.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center w-full ">
                        <h1 className=" text-sm text-shark-300">
                            Nenhum resultado encontrado
                        </h1>
                    </div>
                )}

                {tab === "tracks" && tracksResults.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center w-full ">
                        <h1 className=" text-sm text-shark-300">
                            Nenhum resultado encontrado
                        </h1>
                    </div>
                )}

                {tab === "artists" && artistResults.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center w-full ">
                        <h1 className=" text-sm text-shark-300">
                            Nenhum resultado encontrado
                        </h1>
                    </div>
                )}

                {tab === "profiles" && users.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center w-full ">
                        <h1 className=" text-sm text-shark-300">
                            Nenhum resultado encontrado
                        </h1>
                    </div>
                )}

                {loading && (
                    <>
                        <div
                            className={`
                                                
                        max-w-2xl w-full
                        flex flex-row items-center rounded-xl gap-3 p-2
                    `}
                        >
                            <Skeleton height={40} width={40} radius="lg" />
                            <div className="flex w-[calc(100%-40px)] items-start justify-center flex-col gap-2">
                                <Skeleton height={8} radius="xl" width="60%" />
                                <Skeleton height={8} radius="xl" width="40%" />
                            </div>
                        </div>
                        <div
                            className={`
                                                
                        max-w-2xl w-full
                        flex flex-row items-center rounded-xl gap-3 p-2
                    `}
                        >
                            <Skeleton height={40} width={40} radius="lg" />
                            <div className="flex w-[calc(100%-40px)] items-start justify-center flex-col gap-2">
                                <Skeleton height={8} radius="xl" width="60%" />
                                <Skeleton height={8} radius="xl" width="40%" />
                            </div>
                        </div>
                        <div
                            className={`
                                                
                        max-w-2xl w-full
                        flex flex-row items-center rounded-xl gap-3 p-2
                    `}
                        >
                            <Skeleton height={40} width={40} radius="lg" />
                            <div className="flex w-[calc(100%-40px)] items-start justify-center flex-col gap-2">
                                <Skeleton height={8} radius="xl" width="60%" />
                                <Skeleton height={8} radius="xl" width="40%" />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}