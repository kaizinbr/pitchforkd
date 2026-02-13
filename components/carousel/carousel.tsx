"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import useColors from "@/lib/utils/getColors";
import axios, { all } from "axios";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import NextImage from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import ClassNames from "embla-carousel-class-names";
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
    darkVibrant: string;
    text: string;
    album_id: string;
}

function Item({ url, album }: { url: string; album: CarouselItem }) {
    const { darkVibrant, vibrant, titleTextColor } = useColors(url);
    // console.log(darkVibrant)

    return (
        <Link
            href={`/album/${album.album_id}`}
            className={`
                flex flex-col-reverse 
                rounded-2xl p-4 gap-3
                ${album.text}
                shadow-inner 
                w-full max-w-48 md:max-w-64
                h-full
                transition-all duration-300 

            `}
            style={{
                backgroundColor: album.darkVibrant,
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
                {/* <span className="text-sm">Outras pessoas avaliaram:</span> */}
                <h2 className="font-bold text-base md:text-lg line-clamp-2">
                    {album.title}
                </h2>
                {/* <h3 className="text-base md:text-lg line-clamp-1">
                    {album.artist}
                </h3> */}
            </div>
        </Link>
    );
}

export default function ImageCarousel({
    bannerContent,
    setTopColor,
}: {
    bannerContent: CarouselItem[];
    setTopColor: (color: string) => void;
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            // loop: true,
            align: "center",
            skipSnaps: false,
            dragFree: true,
        },
        [Autoplay(), ClassNames({ snapped: "slideAtivo" })],
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


    const onSlideChange = useCallback(() => {
        if (!emblaApi) return;
        // console.log("Slide changed to index:", emblaApi.selectedScrollSnap());
        setTopColor(bannerContent[emblaApi.selectedScrollSnap()]?.darkVibrant || "#1B3955");
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on("select", onSlideChange);
        emblaApi.on("init", onSlideChange); 

        return () => {
            emblaApi.off("select", onSlideChange);
            emblaApi.off("init", onSlideChange);
        };
    }, [emblaApi, onSlideChange]); 

    const [loading, setLoading] = useState(false);

    

    if (loading) {
        return (
            <div className="w-full max-w-250 mx-auto px-5">
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
