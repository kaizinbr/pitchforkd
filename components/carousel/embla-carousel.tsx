"use client";

import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
    EmblaCarouselType,
    EmblaEventType,
    EmblaOptionsType,
} from "embla-carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";

const TWEEN_FACTOR_BASE = 0.80;

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max);

const ImageCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
            skipSnaps: false,
        },
        [Autoplay()]
    );

    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);

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

    const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
            return slideNode.querySelector(".embla__slide__number") as HTMLElement;
        });
    }, []);

    const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
        tweenFactor.current =
            TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
    }, []);

    const tweenScale = useCallback(
        (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
            const engine = emblaApi.internalEngine();
            const scrollProgress = emblaApi.scrollProgress();
            const slidesInView = emblaApi.slidesInView();
            const isScrollEvent = eventName === "scroll";

            emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
                let diffToTarget = scrollSnap - scrollProgress;
                const slidesInSnap = engine.slideRegistry[snapIndex];

                slidesInSnap.forEach((slideIndex) => {
                    if (isScrollEvent && !slidesInView.includes(slideIndex))
                        return;

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopItem) => {
                            const target = loopItem.target();

                            if (slideIndex === loopItem.index && target !== 0) {
                                const sign = Math.sign(target);

                                if (sign === -1) {
                                    diffToTarget =
                                        scrollSnap - (1 + scrollProgress);
                                }
                                if (sign === 1) {
                                    diffToTarget =
                                        scrollSnap + (1 - scrollProgress);
                                }
                            }
                        });
                    }

                    const tweenValue =
                        1 - Math.abs(diffToTarget * tweenFactor.current);
                    const scale = numberWithinRange(
                        tweenValue,
                        0,
                        1
                    ).toString();
                    const tweenNode = tweenNodes.current[slideIndex];
                    tweenNode.style.transform = `scale(${scale})`;
                });
            });
        },
        []
    );

    useEffect(() => {
        if (!emblaApi) return;

        setTweenNodes(emblaApi);
        setTweenFactor(emblaApi);
        tweenScale(emblaApi);

        emblaApi
            .on("reInit", setTweenNodes)
            .on("reInit", setTweenFactor)
            .on("reInit", tweenScale)
            .on("scroll", tweenScale)
            .on("slideFocus", tweenScale);
    }, [emblaApi, tweenScale]);

    const images = [
        "https://i.scdn.co/image/ab67616d0000b2739389aab1165b6498eba04d8e",
        "https://i.scdn.co/image/ab67616d0000b2739538990ec50c597ab78adfcf",
        "https://i.scdn.co/image/ab67616d0000b2732a40dc3ee1fc592ec0dce3a5",
        "https://i.scdn.co/image/ab67616d0000b2731fcabc8a98dd45fac3daf6ac",
    ];
    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {images.map((image, index) => (
                    <div key={index} className="embla__slide">
                        <div
                            className={`
                                        flex flex-col rounded-3xl p-8 gap-1
                                        bg-gradient-to-br from-indigo-100 from-5% via-indigo-300 via-30% to-slate-700 to-95% text-white
                                        shadow-inner text-center
                                        w-full embla__slide__number
                                    `}
                        >
                            <h2 className="font-semibold text-xl">
                                Avalie Glow Up
                            </h2>
                            <picture
                                className={`
                                                w-full h-auto rounded-xl overflow-hidden
                                            `}
                            >
                                <Image
                                    src={typeof image === "string" ? image : ""}
                                    alt={`Slide ${index + 1}`}
                                    className="embla__slide__img"
                                    height={300}
                                    width={300}
                                />
                            </picture>
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
