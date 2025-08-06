"use client";
import RatingCard from "../user/RatingCard";
import { useState, useEffect, useRef, useCallback } from "react";
import { Review } from "@/lib/utils/types";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "@mantine/core";

const STORAGE_KEY = 'cached-reviews';
const OFFSET_KEY = 'reviews-offset';

export default function DisplayReviews({
    ratings,
    ratingsLength,
}: {
    ratings: Review[] | null;
    ratingsLength: number;
}) {
    const supabase = createClient();
    const [allReviews, setAllReviews] = useState<Review[]>([]);
    const [offset, setOffset] = useState(30);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Ref para o elemento observador
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Função para carregar mais dados
    const loadMoreData = useCallback(async () => {
        if (loadingMore || allReviews.length >= ratingsLength) return;
        
        setLoadingMore(true);
        
        const { data, error } = await supabase
            .from("ratings")
            .select(`*, profiles(*)`)
            .eq("is_published", true)
            .order("created_at", { ascending: false })
            .range(offset, offset + 29);

        if (data && !error) {
            const newReviews = [...allReviews, ...data];
            setAllReviews(newReviews);
            setOffset(offset + 30);
        }
        
        setLoadingMore(false);
    }, [loadingMore, allReviews.length, ratingsLength, offset, allReviews, supabase]);

    // Intersection Observer para detectar quando chegou próximo do fim
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
    }, [loadMoreData, loadingMore, allReviews.length, ratingsLength]);

    // Carregar dados do localStorage na inicialização
    useEffect(() => {
        const cachedReviews = localStorage.getItem(STORAGE_KEY);
        const cachedOffset = localStorage.getItem(OFFSET_KEY);
        
        if (cachedReviews) {
            const parsedReviews = JSON.parse(cachedReviews);
            setAllReviews(parsedReviews);
            
            if (cachedOffset) {
                setOffset(parseInt(cachedOffset));
            }
        } else if (ratings) {
            // Se não tem cache, usa os dados iniciais
            setAllReviews(ratings);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
        }
    }, [ratings]);

    // Salvar no localStorage sempre que allReviews mudar
    useEffect(() => {
        if (allReviews.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
            localStorage.setItem(OFFSET_KEY, offset.toString());
        }
    }, [allReviews, offset]);

    const handleLoadMore = async () => {
        if (loading || loadingMore) return;
        
        setLoading(true);
        
        const { data, error } = await supabase
            .from("ratings")
            .select(`*, profiles(*)`)
            .eq("is_published", true)
            .order("created_at", { ascending: false })
            .range(offset, offset + 29);

        if (data && !error) {
            const newReviews = [...allReviews, ...data];
            setAllReviews(newReviews);
            setOffset(offset + 30);
        }
        
        setLoading(false);
    };

    // Função para limpar cache (opcional)
    const clearCache = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(OFFSET_KEY);
        setAllReviews(ratings || []);
        setOffset(30);
    };

    return (
        <div className="flex flex-col w-full max-w-2xl">
            <h2 className="text-xl font-bold flex px-5 mb-3">Avaliações</h2>
            
            <div className="flex flex-col w-full divide-bunker-800 divide-y">
                {allReviews.map((rating) => (
                    <RatingCard key={rating.id} review={rating} />
                ))}
            </div>
            
            {/* Elemento observador - invisível, apenas para detectar scroll */}
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
            
            {/* Botão manual como fallback (opcional) */}
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
            
            {/* Botão para limpar cache (apenas para desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && (
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