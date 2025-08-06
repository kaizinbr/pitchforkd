"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef, useCallback } from "react";
import RatingCard from "./RatingCard";
import { RatingCardSkeletonList } from "../Skeletons";

export default function UserRatings({ user }: { user: any }) {
    const [ratings, setRatings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(30);
    const [total, setTotal] = useState(0);

    const supabase = createClient();
    
    // Ref para o elemento observador
    const loadMoreRef = useRef<HTMLDivElement>(null);
    
    // Chaves únicas para cada usuário
    const STORAGE_KEY = `user-ratings-${user.id}`;
    const OFFSET_KEY = `user-ratings-offset-${user.id}`;
    const TOTAL_KEY = `user-ratings-total-${user.id}`;

    // Função para carregar mais dados
    const loadMoreData = useCallback(async () => {
        if (loadingMore || ratings.length >= total) return;
        
        setLoadingMore(true);
        
        const { data, error } = await supabase
            .from("ratings")
            .select(
                `*,
                profiles(
                    *
                )`
            )
            .eq("is_published", true)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .range(offset, offset + 29);

        if (data && !error) {
            const newRatings = [...ratings, ...data];
            setRatings(newRatings);
            setOffset(offset + 30);
        }
        
        setLoadingMore(false);
    }, [loadingMore, ratings.length, total, offset, ratings, supabase, user.id]);

    // Intersection Observer para detectar quando chegou próximo do fim
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && !loadingMore && ratings.length < total) {
                    loadMoreData();
                }
            },
            {
                root: null,
                rootMargin: '260px', // Carrega quando estiver 260px antes do final
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
    }, [loadMoreData, loadingMore, ratings.length, total]);

    useEffect(() => {
        async function fetchRatings() {
            // Verificar cache primeiro
            const cachedRatings = localStorage.getItem(STORAGE_KEY);
            const cachedOffset = localStorage.getItem(OFFSET_KEY);
            const cachedTotal = localStorage.getItem(TOTAL_KEY);
            
            if (cachedRatings && cachedTotal) {
                // Usar dados do cache
                const parsedRatings = JSON.parse(cachedRatings);
                setRatings(parsedRatings);
                setTotal(parseInt(cachedTotal));
                
                if (cachedOffset) {
                    setOffset(parseInt(cachedOffset));
                }
                
                setLoading(false);
                return;
            }

            // Se não tem cache, buscar do banco
            const { data, error } = await supabase
                .from("ratings")
                .select(
                    `*,
                    profiles(
                        *
                    )`
                )
                .eq("is_published", true)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .range(0, 29);

            if (error) {
                console.error("Error fetching ratings", error);
                setLoading(false);
                return;
            }

            const { data: totalData, error: totalError } = await supabase
                .from("ratings")
                .select("*")
                .eq("is_published", true)
                .eq("user_id", user.id);

            if (totalError) {
                console.error("Error fetching total ratings", totalError);
            }

            const totalCount = totalData?.length || 0;
            
            // Salvar no cache
            if (data) {
                setRatings(data);
                setTotal(totalCount);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                localStorage.setItem(TOTAL_KEY, totalCount.toString());
                localStorage.setItem(OFFSET_KEY, "30");
            }
            
            setLoading(false);
        }

        fetchRatings();
    }, [user.id]);

    // Salvar no cache sempre que ratings mudar
    useEffect(() => {
        if (ratings.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
            localStorage.setItem(OFFSET_KEY, offset.toString());
            localStorage.setItem(TOTAL_KEY, total.toString());
        }
    }, [ratings, offset, total, STORAGE_KEY, OFFSET_KEY, TOTAL_KEY]);

    // Função para limpar cache (opcional)
    const clearCache = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(OFFSET_KEY);
        localStorage.removeItem(TOTAL_KEY);
        setRatings([]);
        setOffset(30);
        setTotal(0);
        setLoading(true);
        window.location.reload();
    };

    return (
        <div className="w-full flex flex-col gap-4 max-w-2xl">
            {loading ? (
                <RatingCardSkeletonList count={3} />
            ) : ratings.length > 0 ? (
                <>
                    <h2 className="font-semibold flex px-5">Avaliações</h2>
                    <div
                        className={`
                            flex flex-col
                            w-full divide-bunker-800 divide-y
                        `}
                    >
                        {ratings.map((rating) => (
                            <RatingCard key={rating.id} review={rating} />
                        ))}
                    </div>

                    {/* Elemento observador - invisível, apenas para detectar scroll */}
                    {ratings.length < total && (
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
                    {process.env.NODE_ENV === 'development' && (
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