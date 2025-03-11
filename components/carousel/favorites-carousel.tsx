"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import Image from "next/image";
import Link from "next/link";

const FavoritesImageCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        skipSnaps: false,
        dragFree: true,
    });

    const data = [
        {
            albuns: [
                {
                    id: "1vWMw6pu3err6qqZzI3RhH",
                    src: "https://i.scdn.co/image/ab67616d0000b2735a43918ea90bf1e44b7bdcfd",
                    title: "Ruby",
                    artist: "JENNIE",
                },
                {
                    id: "5eoWRkeplmcCL97afSMJVm",
                    src: "https://i.scdn.co/image/ab67616d0000b2738034090e4afb5b053cd3e067",
                    title: "Alter Ego",
                    artist: "LISA",
                },
                {
                    id: "1hmW4opQGq4hIYTbEWsyqW",
                    src: "https://i.scdn.co/image/ab67616d0000b273557019801cd1cb6d8175f3f1",
                    title: "AMORTAGE",
                    artist: "JISOO",
                },
                {
                    id: "7kFyd5oyJdVX2pIi6P4iHE",
                    src: "https://i.scdn.co/image/ab67616d0000b2735074bd0894cb1340b8d8a678",
                    title: "rosie",
                    artist: "ROSÉ",
                },
            ],
            artists: [
                {
                    id: "250b0Wlc5Vk0CoUsaCY84M",
                    src: "https://i.scdn.co/image/ab6761610000e5eba8e3627e392a1d8f539cb575",
                    name: "JENNIE",
                },
                {
                    id: "5L1lO4eRHmJ7a0Q6csE5cT",
                    src: "https://i.scdn.co/image/ab6761610000f1785cd3b3af8b72e32be78571ec",
                    name: "LISA",
                },
                {
                    id: "3eVa5w3URK5duf6eyVDbu9",
                    src: "https://i.scdn.co/image/ab6761610000f178727a1f1f508238a20ac9fdbf",
                    name: "ROSÉ",
                },
                {
                    id: "6UZ0ba50XreR4TM8u322gs",
                    src: "https://i.scdn.co/image/ab6761610000f1789e33dd3ae51452774a133e1f",
                    name: "JISOO",
                }
            ],
        },
    ];
    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                    {data[0].artists.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center size-18 embla__slide__fav"
                        >
                            <Image
                                src={item.src}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};
export default FavoritesImageCarousel;
