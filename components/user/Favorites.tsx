"use client";

import { Tabs } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

import { Plus } from "lucide-react";

function ArtistsList({ artists, isUser }: { artists: any[]; isUser: boolean }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        skipSnaps: false,
        dragFree: true,
    });

    return (
        <>
            {artists.length > 0 ? (
                <div className="embla mt-4" ref={emblaRef}>
                    <div className="embla__container">
                        {artists.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center size-18 embla__slide__fav"
                            >
                                <Image
                                    src={item.src}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="size-18 object-cover rounded-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : isUser ? (
                <div className="flex items-center justify-start mt-4 w-full min-h-18">
                    <Link href="/edit">
                        <div className="flex flex-col items-center justify-center gap-2 size-18 rounded-lg bg-bunker-600 text-white cursor-pointer p-4">
                            <Plus size={24} />
                        </div>
                    </Link>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full min-h-18">
                    <span className="text-bunker-300 text-sm">
                        Nada por aqui ainda...
                    </span>
                </div>
            )}
        </>
    );
}

function AlbunsList({ album, isUser }: { album: any[]; isUser: boolean }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        skipSnaps: false,
        dragFree: true,
    });

    return (
        <>
            {album.length > 0 ? (
                <div className="embla mt-4" ref={emblaRef}>
                    <div className="embla__container">
                        {album.map((item, index) => (
                            <Link
                                key={index}
                                className="flex flex-col items-center size-18 embla__slide__fav"
                                href={`/album/${item.id}`}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.title}
                                    width={80}
                                    height={80}
                                    className="size-18 object-cover rounded-sm"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            ) : isUser ? (
                <div className="flex items-center justify-start mt-4 w-full min-h-18">
                    <Link href="/edit">
                        <div className="flex flex-col items-center justify-center gap-2 size-18 rounded-lg bg-bunker-600 text-white cursor-pointer p-4">
                            <Plus size={24} />
                        </div>
                    </Link>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full min-h-18">
                    <span className="text-bunker-300 text-sm">
                        Nada por aqui ainda...
                    </span>
                </div>
            )}
        </>
    );
}

export default function Favorites({
    favorites,
    isUser,
}: {
    favorites: any;
    isUser: boolean;
}) {
    const albuns = [
        {
            title: "Ruby",
            artist: "JENNIE",
            src: "https://i.scdn.co/image/ab67616d0000b2735a43918ea90bf1e44b7bdcfd",
            from: "#090E0E",
            to: "#E30806",
            text: "text-white",
            album_id: "1vWMw6pu3err6qqZzI3RhH",
        },
        {
            title: "Alter Ego",
            artist: "LISA",
            src: "https://i.scdn.co/image/ab67616d0000b2738034090e4afb5b053cd3e067",
            from: "#0A1017",
            to: "#B86937",
            text: "text-white",
            album_id: "5eoWRkeplmcCL97afSMJVm",
        },
        {
            title: "AMORTAGE",
            artist: "JISOO",
            src: "https://i.scdn.co/image/ab67616d0000b273557019801cd1cb6d8175f3f1",
            from: "#343434",
            to: "#ADADAD",
            text: "text-white",
            album_id: "1hmW4opQGq4hIYTbEWsyqW",
        },
        {
            title: "rosie",
            artist: "ROSÉ",
            src: "https://i.scdn.co/image/ab67616d0000b2735074bd0894cb1340b8d8a678",
            from: "#384A7C",
            to: "#C6AAC3",
            text: "text-white",
            album_id: "7kFyd5oyJdVX2pIi6P4iHE",
        },
    ];

    const artists = [
        {
            name: "JENNIE",
            src: "https://i.scdn.co/image/ab6761610000e5eba8e3627e392a1d8f539cb575",
            id: "250b0Wlc5Vk0CoUsaCY84M",
        },
        {
            name: "LISA",
            src: "https://i.scdn.co/image/ab6761610000f1785cd3b3af8b72e32be78571ec",
            id: "5L1lO4eRHmJ7a0Q6csE5cT",
        },
        {
            name: "ROSÉ",
            src: "https://i.scdn.co/image/ab6761610000f178727a1f1f508238a20ac9fdbf",
            id: "3eVa5w3URK5duf6eyVDbu9",
        },
        {
            name: "JISOO",
            src: "https://i.scdn.co/image/ab6761610000f1789e33dd3ae51452774a133e1f",
            id: "6UZ0ba50XreR4TM8u322gs",
        },
    ];

    return (
        <>
            <Tabs
                defaultValue="artist"
                classNames={{
                    root: "w-full px-5 my-6 max-w-2xl",
                    list: "flex flex-row gap-3 !border-0 before:!border-0 before:!border-transparent",
                    tab: `
                        !text-xs !font-medium !text-bunker-300 data-[active=true]:!text-bunker-100 
                        data-[active=true]:!border-main-500
                        bg-transparent hover:!bg-transparent
                        !px-2 !py-0
                    `,
                }}
            >
                <div className="flex flex-row items-center justify-between w-full font-medium text-xs">
                    <h3 className="">Favoritos</h3>

                    <Tabs.List>
                        <Tabs.Tab value="artist">Artistas</Tabs.Tab>
                        <Tabs.Tab value="album">Álbums</Tabs.Tab>
                    </Tabs.List>
                </div>

                <Tabs.Panel value="artist">
                    <ArtistsList
                        isUser={isUser}
                        artists={favorites[0].artists}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="album">
                    <AlbunsList isUser={isUser} album={favorites[0].albuns} />
                </Tabs.Panel>
            </Tabs>
        </>
    );
}
