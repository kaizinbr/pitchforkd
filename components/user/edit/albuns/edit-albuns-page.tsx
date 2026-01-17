"use client";
import { Reorder } from "framer-motion";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import axios from "axios";

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


export default function EditAlbuns({ initialAlbuns }: { initialAlbuns: any }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [albuns, setAlbuns] = useState<
        {
            id: string;
            src: string;
            title: string;
            type?: string;
            artist: string;
        }[]
    >(initialAlbuns || []);

    const router = useRouter();
    async function saveFavorites({
        albuns,
    }: {
        albuns: {
            id: string;
            src: string;
            title: string;
            type?: string;
            artist: string;
        }[];
    }) {
        try {
            setLoading(true);

            const response = await axios.post("/api/user/profile/favorites/albuns", {
                albuns,
            });
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
                            text-white text-sm font-semibold! rounded-xl
                            fixed right-4
                            max-w-2xl mx-auto top-4
                            cursor-pointer
                            transition-all duration-300
                            z-500
                            ${disabled ? "bg-gray-400 cursor-not-allowed" : " bg-main-500 hover:bg-main-600 cursor-pointer"}
                        `}
                onClick={() => {
                    saveFavorites({
                        albuns,
                    });

                    notifications.show({
                        // title: "Default notification",
                        message: "Álbuns favoritos salvos com sucesso! 🌟",
                        radius: "lg",
                        color: "#00ac1c",
                        position: "top-right",
                        autoClose: 7000,
                        style: { backgroundColor: "#2f3842" },
                    });
                }}
                disabled={disabled}
            >
                {loading ? "Salvando..." : "Salvar"}
            </button>

            <Search data={albuns} setData={setAlbuns} />

            <Reorder.Group
                axis="y"
                onReorder={setAlbuns}
                values={albuns}
                className="mt-8 flex flex-col gap-2 mb-4 w-full"
            >
                {albuns.map((album: Album, index: number) => (
                    <Item
                        key={album.id}
                        Album={album}
                        index={index}
                        setData={setAlbuns}
                    />
                ))}
            </Reorder.Group>
        </div>
    );
}
