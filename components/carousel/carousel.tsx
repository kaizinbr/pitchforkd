"use client";

import React, { useCallback, useEffect, useState } from "react";
import useColors from "@/lib/utils/getColors";
import axios, { all } from "axios";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import NextImage from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import ColorThief from "colorthief";
import { lightenColor, getTextColor } from "@/components/album/gen-gradient";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";

interface CarouselItem {
    title: string;
    artist: string;
    src: string;
    from: string;
    to: string;
    text: string;
    album_id: string;
}

function Item({ url, album }: { url: string; album: CarouselItem }) {
    const { darkVibrant, lightMuted, titleTextColor } = useColors(url);

    return (
        <Link
            href={`/album/${album.album_id}`}
            className={`
                flex md:flex-row flex-col-reverse 
                rounded-3xl p-8 gap-3
                ${album.text}
                shadow-inner 
                w-full max-w-[422px] md:max-w-[750px] lg:max-w-[1000px]
                max-[485px]:h-[485px]
                transition-all duration-300 
            `}
            style={{
                backgroundImage: `linear-gradient(to bottom right, ${darkVibrant}, ${lightenColor(lightMuted, 1.5)})`,
            }}
        >
            <picture
                className={`
                    w-full h-auto rounded-xl overflow-hidden
                    md:max-w-64
                `}
            >
                <NextImage
                    src={album.src}
                    alt={`${album.title} by ${album.artist}`}
                    className="embla__slide__img"
                    height={256}
                    width={256}
                    loading="lazy"
                />
            </picture>
            <div
                className="flex flex-col items-start justify-center pt-8 md:pt-0"
                style={{ color: titleTextColor }}
            >
                <span className="text-sm">Outras pessoas avaliaram:</span>
                <h2 className="font-bold text-lg md:text-2xl line-clamp-2">
                    {album.title}
                </h2>
                <h3 className="text-base md:text-lg line-clamp-1">
                    {album.artist}
                </h3>
            </div>
        </Link>
    );
}

export default function ImageCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
            skipSnaps: false,
        },
        [Autoplay()]
    );

    const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const autoplay = emblaApi?.plugins()?.autoplay;
        if (!autoplay) return;

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? autoplay.reset
                : autoplay.stop;

        resetOrStop();
    }, []);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi, onNavButtonClick);

    const [bannerContent, setBannerContent] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(false);

    // const allColors = useColors(
    //     bannerContent[0]?.src ||
    //         "https://i.scdn.co/image/ab67616d0000b2733533ec688f7b48a135fd1e47"
    // );
    // console.log("banner colors:", allColors);

    // Função para extrair cores de uma imagem
    const extractColors = (
        imageUrl: string
    ): Promise<{ from: string; to: string; text: string }> => {
        return new Promise((resolve) => {
            if (!imageUrl) {
                console.error("URL da imagem não fornecida");
                resolve({
                    from: "#1B3955",
                    to: "#A8B8C4",
                    text: "text-white",
                });
                return;
            }

            const img = new window.Image();
            img.crossOrigin = "anonymous";

            img.onerror = () => {
                console.error("Erro ao carregar a imagem:", imageUrl);
                // Fallback para cores padrão
                resolve({
                    from: "#1B3955",
                    to: "#A8B8C4",
                    text: "text-white",
                });
            };

            img.src = imageUrl;
        });
    };

    // Função para processar um item e extrair suas cores
    const processItem = async (item: any): Promise<CarouselItem> => {
        const baseItem = {
            title: item.track.album.name,
            artist: item.track.album.artists[0].name,
            src:
                item.track.album.images[1]?.url ||
                item.track.album.images[0]?.url,
            from: "#1B3955",
            to: "#A8B8C4",
            text: "text-white",
            album_id: item.track.album.id,
        };

        try {
            // const colors = await extractColors(baseItem.src);
            return {
                ...baseItem,
                // from: colors.from,
                // to: colors.to,
                // text: colors.text,
            };
        } catch (error) {
            console.error("Erro ao processar item:", error);
            return baseItem;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/spot/banner`);
                console.log("Banner API response:", response.data);

                // Processar cada item e extrair cores em paralelo
                const itemPromises = response.data.tracks.items.map(
                    (item: any) => processItem(item)
                );

                // Aguardar todos os items serem processados
                const processedItems = await Promise.all(itemPromises);

                setBannerContent(processedItems);
                console.log("Banner content with colors:", processedItems);
            } catch (error) {
                console.error("Erro ao buscar dados do banner:", error);

                // Fallback para dados estáticos se a API falhar
                const fallbackData = [
                    {
                        title: "Only cry in the rain",
                        artist: "CHUU",
                        src: "https://i.scdn.co/image/ab67616d0000b2733533ec688f7b48a135fd1e47",
                        from: "#1B3955",
                        to: "#A8B8C4",
                        text: "text-white",
                        album_id: "5BenIQ2E8TFdZoAtPjUP9a",
                    },
                ];
                setBannerContent(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full max-w-[1000px] mx-auto px-5">
                <div className="animate-pulse">
                    <div className="bg-shark-800 rounded-3xl h-64 md:h-80"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {bannerContent.map((album, index) => (
                    <div
                        key={`${album.album_id}-${index}`}
                        className="embla__slide"
                    >
                        <Item url={album.src} album={album} />
                    </div>
                ))}
            </div>
            <div className="embla__controls max-w-2xl mx-auto justify-end pr-5 md:pr-0">
                <div className="embla__buttons">
                    <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                    />
                    <NextButton
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                    />
                </div>
            </div>
        </div>
    );
}
