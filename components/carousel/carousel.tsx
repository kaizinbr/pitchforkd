"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { text } from "stream/consumers";

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

    const images = [
        "https://i.scdn.co/image/ab67616d0000b273e4f5675b69f75a4ff99302f0",
        "https://i.scdn.co/image/ab67616d0000b2739538990ec50c597ab78adfcf",
        "https://i.scdn.co/image/ab67616d0000b2732a40dc3ee1fc592ec0dce3a5",
        "https://i.scdn.co/image/ab67616d0000b2731fcabc8a98dd45fac3daf6ac",
    ];

    const data = [
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
            title: "The Star Chapter: SANCTUARY",
            artist: "TOMORROW X TOGETHER",
            src: "https://i.scdn.co/image/ab67616d0000b273b612b8d797e8e3ec375ca60d",
            from: "#384A7C",
            to: "#C6AAC3",
            text: "text-white",
            album_id: "72JboNccBYyXR676YNfcYE",
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
            title: "The Star Chapter: SANCTUARY",
            artist: "TOMORROW X TOGETHER",
            src: "https://i.scdn.co/image/ab67616d0000b273b612b8d797e8e3ec375ca60d",
            from: "#384A7C",
            to: "#C6AAC3",
            text: "text-white",
            album_id: "72JboNccBYyXR676YNfcYE",
        },
    ];
    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {data.map((image, index) => (
                    <div key={index} className="embla__slide">
                        {/* <div
                            className={`
                                        flex flex-col rounded-3xl p-8 gap-1
                                        bg-gradient-to-br from-[#85446E] to-[#170D15] text-white
                                        shadow-inner text-center
                                        w-full max-w-[422px] md:max-w-[750px] lg:max-w-[1000px]
                                    `}
                        >
                            <h2 className="font-semibold text-xl">
                                Avalie Glow Up
                            </h2>
                            <picture
                                className={`
                                                w-full h-auto rounded-xl overflow-hidden
                                                md:max-w-64
                                            `}
                            >
                                <Image
                                    src={typeof image === "string" ? image : ""}
                                    alt={`Slide ${index + 1}`}
                                    className="embla__slide__img"
                                    height={256}
                                    width={256}
                                />
                            </picture>
                        </div> */}
                        <div
                            className={`
                                        flex md:flex-row flex-col-reverse
                                        rounded-3xl p-8 gap-3
                                        bg-gradient-to-br from-[${image.from}] to-[${image.to}] ${image.text}
                                        shadow-inner text-center
                                        w-full max-w-[422px] md:max-w-[750px] lg:max-w-[1000px]
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
                            <div className="flex flex-col gap-2 items-start justify-center pt-8">
                                <span className="text-sm text-bunker-200">Outras pessoas avaliaram:</span>
                                <h2 className="font-bold text-xl">
                                    {image.title}
                                </h2>
                                <h3 className="font-semibold text-lg">
                                    {image.artist}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="embla__controls">
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
