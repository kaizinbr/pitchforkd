"use client";
import RatingCard from "../user/RatingCard";
import { useState, useEffect, useRef, useCallback } from "react";
import { Review } from "@/lib/utils/types";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { Loader } from "@mantine/core";

const STORAGE_KEY = "cached-reviews";
const ALBUMS_STORAGE_KEY = "cached-albums";
const OFFSET_KEY = "reviews-offset";

export default function DisplayReviews({
    ratings,
    ratingsLength,
}: {
    ratings: Review[] | null;
    ratingsLength: number;
}) {
    const supabase = createClient();
    const [allReviews, setAllReviews] = useState<Review[]>([]);
    const [allAlbums, setAllAlbums] = useState<{ [key: string]: any }>({});
    const [offset, setOffset] = useState(20);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Ref para o elemento observador
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Função para buscar álbuns que ainda não estão no cache
    const fetchMissingAlbums = async (albumIds: string[]) => {
        // Filtrar IDs que já não temos no cache
        const missingIds = albumIds.filter(id => !allAlbums[id]);
        
        if (missingIds.length === 0) {
            console.log("Todos os álbuns já estão em cache");
            return;
        }

        try {
            const idsString = missingIds.join(",");
            console.log("Buscando álbuns faltantes:", missingIds);
            
            const response = await axios.get(
                `/api/spot/album/multiple?ids=${idsString}`
            );
            
            if (response.data.albums) {
                // Converter array em objeto com chave sendo o album_id
                const albumsMap = response.data.albums.reduce((acc: any, album: any) => {
                    acc[album.id] = album;
                    return acc;
                }, {});
                
                // Adicionar aos álbuns existentes
                setAllAlbums(prev => ({ ...prev, ...albumsMap }));
                
                console.log("Álbuns carregados:", Object.keys(albumsMap));
            }
            
        } catch (error) {
            console.error("Erro ao buscar álbuns:", error);
        }
    };

    // Função para carregar mais dados
    const loadMoreData = useCallback(async () => {
        if (loadingMore || allReviews.length >= ratingsLength) return;

        setLoadingMore(true);

        try {
            const { data, error } = await supabase
                .from("ratings")
                .select(`*, profiles(*)`)
                .eq("is_published", true)
                .order("created_at", { ascending: false })
                .range(offset, offset + 19);

            if (data && !error) {
                const newReviews = [...allReviews, ...data];
                setAllReviews(newReviews);
                setOffset(offset + 20);

                // Buscar álbuns das novas reviews
                const newAlbumIds = data.map((review: Review) => review.albumId!);
                await fetchMissingAlbums(newAlbumIds);
            }
        } catch (error) {
            console.error("Erro ao carregar mais reviews:", error);
        }

        setLoadingMore(false);
    }, [loadingMore, allReviews.length, ratingsLength, offset, allReviews, supabase, allAlbums]);

    // Intersection Observer para scroll infinito
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && !loadingMore && allReviews.length < ratingsLength) {
                    loadMoreData();
                }
            },
            {
                root: null,
                rootMargin: '300px', // Carrega quando estiver 300px antes do final
                threshold: 0.1
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
    }, [loadMoreData, loadingMore, allReviews.length, ratingsLength]);

    // Carregar dados iniciais
    useEffect(() => {
        const initializeData = async () => {
            // Tentar carregar do cache primeiro
            // const cachedReviews = sessionStorage.getItem(STORAGE_KEY);
            // const cachedAlbums = sessionStorage.getItem(ALBUMS_STORAGE_KEY);
            // const cachedOffset = sessionStorage.getItem(OFFSET_KEY);

            // if (cachedReviews && cachedAlbums) {
            //     console.log("Carregando dados do cache");
            //     setAllReviews(JSON.parse(cachedReviews));
            //     setAllAlbums(JSON.parse(cachedAlbums));
                
            //     if (cachedOffset) {
            //         setOffset(parseInt(cachedOffset));
            //     }
            //     return;
            // }

            // Se não tem cache, usar dados iniciais
            if (ratings) {
                console.log("Inicializando com dados do servidor");
                setAllReviews(ratings);
                
                // Buscar álbuns das reviews iniciais
                const initialAlbumIds = ratings.map((review: Review) => review.albumId!);
                await fetchMissingAlbums(initialAlbumIds);
            }
        };

        initializeData();
    }, [ratings]);

    // Salvar no cache sempre que os dados mudarem
    // useEffect(() => {
    //     if (allReviews.length > 0) {
    //         sessionStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
    //         sessionStorage.setItem(OFFSET_KEY, offset.toString());
    //     }
    // }, [allReviews, offset]);

    // useEffect(() => {
    //     if (Object.keys(allAlbums).length > 0) {
    //         sessionStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(allAlbums));
    //     }
    // }, [allAlbums]);

    // Botão manual para carregar mais (fallback)
    const handleLoadMore = async () => {
        if (loading || loadingMore) return;
        await loadMoreData();
    };

    // Função para limpar cache
    const clearCache = () => {
        // sessionStorage.removeItem(STORAGE_KEY);
        // sessionStorage.removeItem(ALBUMS_STORAGE_KEY);
        // sessionStorage.removeItem(OFFSET_KEY);
        // // setAllReviews(ratings || []);
        // setAllAlbums({});
        // setOffset(20);
    };

    // Função para obter álbum por ID
    const getAlbumById = (albumId: string) => {
        return allAlbums[albumId] || null;
    };

    return (
        <div className="flex flex-col w-full max-w-2xl">
            <h2 className="text-xl font-bold flex px-5 mb-3">Avaliações</h2>

            <div className="flex flex-col w-full divide-shark-900 divide-y">
                {allReviews.map((rating) => (
                    <RatingCard 
                        key={rating.id} 
                        review={rating} 
                        album={getAlbumById(rating.albumId!)}
                    />
                ))}
            </div>

            {/* Elemento observador para scroll infinito */}
            {allReviews.length < ratingsLength && (
                <div
                    ref={loadMoreRef}
                    className="w-full py-4 flex justify-center"
                >
                    {loadingMore && (
                        <div className="flex items-center gap-2 text-gray-400">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                            <span className="text-sm">Carregando mais...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Botão manual como fallback */}
            {ratingsLength > 5 && allReviews.length < ratingsLength && !loadingMore && (
                <button
                    onClick={handleLoadMore}
                    className="flex justify-center items-center py-2 mx-4 md:mx-0 mt-6 rounded-xl text-center !font-medium bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600 cursor-pointer transition-all duration-200 opacity-50 text-sm"
                >
                    {loading ? (
                        <Loader size={24.8} color="white" />
                    ) : (
                        "Carregar mais manualmente"
                    )}
                </button>
            )}

            {/* Botão para limpar cache (desenvolvimento) */}
            {process.env.NODE_ENV === "development" && (
                <button
                    onClick={clearCache}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-300"
                >
                    Limpar Cache
                </button>
            )}
        </div>
    );
}