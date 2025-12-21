"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef, useCallback } from "react";
import RatingCard from "./RatingCard";
import { RatingCardSkeletonList } from "../Skeletons";
import axios from "axios";

export default function UserRatings({ profile }: { profile: any }) {
    const [ratings, setRatings] = useState<any[]>([]);
    const [allAlbums, setAllAlbums] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [ratingsApiPage, setRatingsApiPage] = useState(1);

    const [offset, setOffset] = useState(20);
    const [total, setTotal] = useState(0);

    const supabase = createClient();

    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Chaves únicas para cada usuário
    const STORAGE_KEY = `user-ratings-${profile.id}`;
    const OFFSET_KEY = `user-ratings-offset-${profile.id}`;
    const TOTAL_KEY = `user-ratings-total-${profile.id}`;
    const ALBUMS_KEY = `user-albums-${profile.id}`;

    // Carregar dados iniciais e álbuns
    useEffect(() => {
        async function fetchRatings() {
            const cachedRatings = sessionStorage.getItem(STORAGE_KEY);
            const cachedOffset = sessionStorage.getItem(OFFSET_KEY);
            const cachedTotal = sessionStorage.getItem(TOTAL_KEY);
            const cachedAlbums = sessionStorage.getItem(ALBUMS_KEY);

            if (cachedRatings && cachedTotal && cachedAlbums) {
                setRatings(JSON.parse(cachedRatings));
                setTotal(parseInt(cachedTotal));
                setAllAlbums(JSON.parse(cachedAlbums));
                if (cachedOffset) setOffset(parseInt(cachedOffset));
                setLoading(false);
                return;
            }

            // Buscar todos os ratings do banco
            const initialRatings = await axios.get(
                `/api/user/${profile.username}/ratings?p=1`
            );

            setTotal(initialRatings.data.total);
            console.log(total)
            setRatings(initialRatings.data.ratings);
            setRatingsApiPage(initialRatings.data.next);

            // setTotal(totalCount);
            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(initialRatings.data.ratings)
            );
            // sessionStorage.setItem(TOTAL_KEY, totalCount.toString());
            sessionStorage.setItem(OFFSET_KEY, "20");

            // Buscar álbuns das ratings iniciais
            const initialAlbumIds = initialRatings.data.ratings.map(
                (r: any) => r.albumId
            );
            setAllAlbums(initialAlbumIds);
            await fetchMissingAlbums(initialAlbumIds);

            setLoading(false);
        }

        fetchRatings();
    }, [profile.id]);

    // Busca álbuns faltantes em lotes de até 20 IDs
    const fetchMissingAlbums = async (albumIds: string[]) => {
        const missingIds = albumIds.filter((id) => !allAlbums[id]);
        if (missingIds.length === 0) return;

        // Dividir em lotes de 20
        for (let i = 0; i < missingIds.length; i += 20) {
            const batch = missingIds.slice(i, i + 20);
            try {
                const idsString = batch.join(",");
                const response = await axios.get(
                    `/api/spot/album/multiple?ids=${idsString}`
                );
                if (response.data.albums) {
                    const albumsMap = response.data.albums.reduce(
                        (acc: any, album: any) => {
                            acc[album.id] = album;
                            return acc;
                        },
                        {}
                    );
                    setAllAlbums((prev) => ({ ...prev, ...albumsMap }));
                }
            } catch (error) {
                console.error("Erro ao buscar álbuns:", error);
            }
        }
    };

    // Carregar mais ratings e buscar álbuns
    const loadMoreData = useCallback(async () => {
        if (loadingMore || ratings.length >= total) return;

        setLoadingMore(true);

        const getRatings = await axios.get(
            `/api/user/${profile.username}/ratings?p=${ratingsApiPage}`
        );

        if (getRatings) {
            const newRatings = [...ratings, ...getRatings.data.ratings];
            setRatings(newRatings);
            setOffset(offset + 20);
            setRatingsApiPage(getRatings.data.next);

            // Atualizar cache
            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(newRatings)
            );
            sessionStorage.setItem(OFFSET_KEY, (offset + 20).toString());

            // Buscar álbuns das novas ratings
            const newAlbumIds = getRatings.data.ratings.map(
                (r: any) => r.albumId
            );
            await fetchMissingAlbums(newAlbumIds);
        }

        setLoadingMore(false);
    }, [
        loadingMore,
        ratings.length,
        total,
        offset,
        ratings,
        supabase,
        profile.id,
        allAlbums,
    ]);

    // // Intersection Observer para scroll infinito
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (
                    target.isIntersecting &&
                    !loadingMore &&
                    ratings.length < total
                ) {
                    loadMoreData();
                    console.log("Carregando mais avaliações...");
                }
            },
            {
                root: null,
                rootMargin: "260px",
                threshold: 0.1,
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreData, loadingMore, ratings.length, total]);

    // // Salvar ratings e offset no cache
    // useEffect(() => {
    //     if (ratings.length > 0) {
    //         sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    //         sessionStorage.setItem(OFFSET_KEY, offset.toString());
    //         sessionStorage.setItem(TOTAL_KEY, total.toString());
    //     }
    // }, [ratings, offset, total, STORAGE_KEY, OFFSET_KEY, TOTAL_KEY]);

    // // Salvar álbuns no cache
    // useEffect(() => {
    //     if (Object.keys(allAlbums).length > 0) {
    //         sessionStorage.setItem(ALBUMS_KEY, JSON.stringify(allAlbums));
    //     }
    // }, [allAlbums, ALBUMS_KEY]);

    // Função para limpar cache (opcional)
    const clearCache = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(OFFSET_KEY);
        sessionStorage.removeItem(TOTAL_KEY);
        sessionStorage.removeItem(ALBUMS_KEY);
        setRatings([]);
        setAllAlbums({});
        setOffset(20);
        setTotal(0);
        setLoading(true);
        window.location.reload();
    };

    // Função para obter álbum por ID
    const getAlbumById = (albumId: string) => {
        return allAlbums[albumId] || null;
    };

    return (
        <div className="w-full flex flex-col gap-4 max-w-2xl">
            {loading ? (
                <RatingCardSkeletonList count={3} />
            ) : ratings.length > 0 ? (
                <>
                    <div
                        className={`
                            flex flex-col
                            w-full divide-shark-800 divide-y
                        `}
                    >
                        {ratings.map((rating) => (
                            <RatingCard
                                key={rating.id}
                                review={rating}
                                album={getAlbumById(rating.albumId)}
                            />
                        ))}
                    </div>

                    {/* Elemento observador - invisível, apenas para detectar scroll */}
                    {/* {ratings.length < total && (
                        <div
                            ref={loadMoreRef}
                            className="w-full py-4 flex justify-center"
                        >
                            {loadingMore && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                    <span className="text-sm">
                                        Carregando mais...
                                    </span>
                                </div>
                            )}
                        </div>
                    )} */}

                    {/* Botão manual como fallback (opcional) */}
                    {total > 5 && ratings.length < total && !loadingMore && (
                        <button
                            onClick={loadMoreData}
                            className={`
                                flex justify-center items-center py-2 mx-5 rounded-xl 
                                bg-orange-600 hover:bg-orange-400 transition-all duration-200 cursor-pointer 
                                text-white font-bold opacity-50 text-sm
                            `}
                        >
                            Carregar mais manualmente
                        </button>
                    )}

                    {/* Botão para limpar cache (apenas desenvolvimento) */}
                    {process.env.NODE_ENV === "development" && (
                        <button
                            onClick={clearCache}
                            className="mt-2 text-xs text-gray-500 hover:text-gray-300 mx-5"
                        >
                            Limpar Cache do Usuário
                        </button>
                    )}
                </>
            ) : (
                <div className="text-xl font-bold px-5 mt-10 text-center w-full">
                    <h2 className="">Nenhuma avaliação ainda</h2>
                </div>
            )}
        </div>
    );
}
