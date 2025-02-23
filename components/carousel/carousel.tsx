"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";

const ImageCarousel = () => {
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

    const data = [
        {
            title: "The Star Chapter: SANCTUARY",
            artist: "TOMORROW X TOGETHER",
            src: "https://i.scdn.co/image/ab67616d0000b273b612b8d797e8e3ec375ca60d",
            from: "#384A7C",
            to: "#C6AAC3",
            text: "text-white",
            album_id: "72JboNccBYyXR676YNfcYE",
        },
        {
            title: "Abracadabra",
            artist: "Lady Gaga",
            src: "https://i.scdn.co/image/ab67616d0000b27325304f6dc9dea023ce4b985c",
            from: "#343434",
            to: "#ADADAD",
            text: "text-white",
            album_id: "2I6LyArz82waG94e9V5B9d",
        },
        {
            title: "minisode 3: TOMORROW",
            artist: "TOMORROW X TOGETHER",
            src: "https://i.scdn.co/image/ab67616d0000b27303c996028737858321d2ffe0",
            from: "#FE552A",
            to: "#FA9579",
            text: "text-white",
            album_id: "0mDwrOXZHN1lgCNeBvkBbj",
        },
        {
            title: "I Did: Bloom (Deluxe)",
            artist: "Yves",
            src: "https://i.scdn.co/image/ab67616d0000b2731fcabc8a98dd45fac3daf6ac",
            from: "#85446E",
            to: "#170D15",
            text: "text-white",
            album_id: "2haRGdLvimDfNlDBW1LAt1",
        },
        {
            title: "ExtraL (feat. Doechii)",
            artist: "JENNIE, Doechii",
            src: "https://i.scdn.co/image/ab67616d0000b2734ddd2d60547b0ef37062c2fb",
            from: "#541E42",
            to: "#B37165",
            text: "text-white",
            album_id: "4EBFO1svuZ9BMyO78JZ9zr",
        },
        {
            title: "What A Devastating Turn of Events",
            artist: "Rachel Chinouriri",
            src: "https://i.scdn.co/image/ab67616d0000b273e4f5675b69f75a4ff99302f0",
            from: "#A7A3B5",
            to: "#2E272D",
            text: "text-white",
            album_id: "1Td1oiZTQFYR7N1QX00uhr",
        },
    ];
    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {data.map((image, index) => (
                    <div key={index} className="embla__slide">
                        <Link
                            href={`/album/${image.album_id}`}
                            
                            className={`
                                        flex md:flex-row flex-col-reverse 
                                        rounded-3xl p-8 gap-3
                                        bg-gradient-to-br from-[${image.from}] to-[${image.to}] ${image.text}
                                        shadow-inner 
                                        w-full max-w-[422px] md:max-w-[750px] lg:max-w-[1000px]
                                        max-[485px]:h-[485px]
                                    `}
                            style={{backgroundImage: `linear-gradient(to bottom right, ${image.from}, ${image.to})`}}
                        >
                            <picture
                                className={`
                                                w-full h-auto rounded-xl overflow-hidden
                                                md:max-w-64
                                            `}
                            >
                                <Image
                                    src={
                                        typeof image.src === "string"
                                            ? image.src
                                            : ""
                                    }
                                    alt={`Slide ${index + 1}`}
                                    className="embla__slide__img"
                                    height={256}
                                    width={256}
                                />
                            </picture>
                            <div className="flex flex-col items-start justify-center pt-8 md:pt-0">
                                <span className="text-sm text-bunker-200">Outras pessoas avaliaram:</span>
                                <h2 className="font-bold text-lg md:text-2xl">
                                    {image.title}
                                </h2>
                                <h3 className="font-semibold text-base md:text-lg">
                                    {image.artist}
                                </h3>
                            </div>
                        </Link>
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
};
export default ImageCarousel;
