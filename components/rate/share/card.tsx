import Avatar from "@/components/ui/Avatar";
import Image from "next/image";
import formatRate from "@/lib/utils/formatRate";
import { Album, Review } from "@/lib/utils/types";
import { darkenColor } from "@/components/album/gen-gradient";
import { useEffect, useState } from "react";
import localFont from "next/font/local";



export default function Card({
    currentColor,
    color1,
    color2,
    color3,
    album,
    review,
    cardStyle,
}: {
    currentColor: string;
    color1: string;
    color2: string;
    color3: string;
    album: Album;
    review: Review;
    cardStyle: "dynamic" | "linear" | "spotlight";
}) {
    
    return (
        <>
            <div
                className={`
                        absolute h-8/10 w-full z-0 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                        font-walsheim
                        ${cardStyle === "linear" ? "" : "hidden"}
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${currentColor}, black)`,
                }}
            ></div>
            <div
                className={`
                        absolute size-full z-0 from-40 
                        top-0 overflow-hidden
                        transition-all duration-200 ease-in-out
                        ${cardStyle === "dynamic" ? "" : "hidden"}
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${darkenColor(currentColor, 1.5)}, transparent)`,
                    filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center blur- md:m-auto md:max-w-lg"
                >
                            <div
                                style={{ backgroundColor: color1 }}
                                className={`absolute rounded-full w-50 h-70 -top-12 -left-12 blur-3xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: color2 }}
                                className={`absolute rounded-full top-24 h-20 w-90 -rotate-60 blur-3xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: color3 }}
                                className={`absolute rounded-full -right-12 -top-12 w-40 h-100 blur-3xl`}
                            ></div>
                        </div>
            </div>
            <div className="w-full relative mb-3 z-10">
                <Avatar
                    size={28}
                    src={review.Profile.avatarUrl}
                    className={"size-8 absolute top-[14px] z-20 mx-auto"}
                    isIcon
                />
                <Image
                    src={album.images[0]?.url}
                    alt={album.name}
                    width={152}
                    height={152}
                    className="rounded-lg max-w-full w-38 shadow-xl relative mx-auto z-10"
                />
                <div
                    className={`
                                absolute w-full -z-10 top-[28px]
                                ${cardStyle === "spotlight" ? "" : "hidden"}
                            `}
                >
                    <div
                        className="size-38 blur-[80px] mx-auto max-w-full"
                        style={{ backgroundColor: currentColor }}
                    />
                </div>
            </div>
            <p className="text-xl !font-extrabold mb-3 z-10">
                {formatRate(Number(review.total))}
            </p>
            <p className=" text-[10px] text-center mb-1 max-w-full line-clamp-2 z-10">
                {review.Profile.name || review.Profile.username} avaliou{" "}
            </p>
            <p className=" text-[10px] text-center mb-1 max-w-full line-clamp-2 z-10">
                <span className="!font-bold">{album.name}</span>
            </p>
            <p className=" text-[10px] text-center mb-4 max-w-full line-clamp-2 z-10 text-shark-300">
                <span className="!font-bold">{album.artists[0].name}</span>
            </p>

            <p className="text-[8px] text-shark-300 text-center z-10 font-light">
                Veja mais em pitchforkd.me
            </p>
        </>
    );
}
