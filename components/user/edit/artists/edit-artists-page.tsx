"use client";
import { Reorder } from "framer-motion";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

import * as React from "react";

import { Item } from "./Item";
import Search from "./Search";

interface Album {
    id: string;
    src: string;
    title: string;
    type?: string;
    artist: string;
}

export default function EditArtists({ profile }: { profile: any }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [artists, setArtists] = useState<
        {
            id: string;
            src: string;
            name: string;
        }[]
    >(profile.favorites[0].artists);

    const router = useRouter();
    async function saveFavorites({
        artists,
    }: {
        artists: {
            id: string;
            src: string;
            name: string;
        }[];
    }) {
        try {
            setLoading(true);

            const { error } = await supabase.from("profiles").upsert({
                id: profile?.id as string,
                favorites: [{ artists, albuns: profile.favorites[0].albuns }],
            });
            if (error) throw error;
            router.push(`/edit`);
        } catch (error) {
            alert("Error updating the data!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-widget flex flex-col justify-center w-full px-5 max-w-2xl pt-20 md:px-0 md:pl-16 relative">
            <button
                className={`
                            py-2 px-6
                            flex justify-center items-center
                            text-white text-sm !font-semibold rounded-xl
                            fixed right-4
                            max-w-2xl mx-auto top-4
                            cursor-pointer
                            transition-all duration-300
                            z-[500]
                            ${disabled ? "bg-gray-400 cursor-not-allowed" : " bg-green-pastel hover:bg-main-600 cursor-pointer"}
                        `}
                onClick={() => {
                    saveFavorites({
                        artists,
                    });
                    notifications.show({
                        // title: "Default notification",
                        message: "Artistas favoritos salvos com sucesso! 🌟",
                        radius: "lg",
                        color: "#00ac1c",
                        autoClose: 7000,
                        style: { backgroundColor: "#2f3842" },
                    });
                }}
                disabled={disabled}
            >
                {loading ? "Salvando..." : "Salvar"}
            </button>

            <Search data={artists} setData={setArtists} />

            <Reorder.Group
                axis="y"
                onReorder={setArtists}
                values={artists}
                className="mt-8 flex flex-col gap-2 mb-4 w-full"
            >
                {artists.map((artist, index: number) => (
                    <Item
                        key={artist.id}
                        artist={artist}
                        index={index}
                        setData={setArtists}
                    />
                ))}
            </Reorder.Group>
        </div>
    );
}
