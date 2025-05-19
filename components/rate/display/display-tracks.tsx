"use client";

import { Rating, Review } from "@/lib/utils/types";
import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BsExplicitFill } from "react-icons/bs";
import Avatar from "@/components/ui/Avatar";

export default function tracksTracksDisplay({
    tracks,
    loading,
    ratings,
    rate,
}: {
    tracks: any;
    loading: boolean;
    ratings: Rating[];
    rate: Review;
}) {
    const [openComment, setOpenComment] = useState<string | null>(null);

    const discTracks = tracks.reduce((acc: any, track: any) => {
        if (!acc[track.disc_number]) {
            acc[track.disc_number] = [];
        }
        acc[track.disc_number].push(track);
        return acc;
    }, {});
    console.log(discTracks);

    return (
        <div className="w-full max-w-2xl">
            {loading ? (
                <div className=""></div>
            ) : discTracks ? (
                <div className="flex flex-col gap-4">
                    {Object.values(discTracks).map(
                        (disc: any, index: number) => (
                            <div className="mt-5" key={index}>
                                {disc.length > 1 ? (
                                    <h2 className="text-lg font-bold w-full flex p-5">
                                        Disco {index + 1}
                                    </h2>
                                ) : null}
                                <div className="w-full text-sm text-left">
                                    <div className="text-xs text-bunker-300 uppercase w-full  grid grid-cols-6 gap-4 items-center">
                                        <div className="pl-5 py-3 col-span-1">
                                            #
                                        </div>
                                        <div className="px-2 py-3 col-span-4">
                                            Nome
                                        </div>
                                        <div className="pr-5 pl-4 py-3 text-end col-start-6">
                                            Nota
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        {disc.map(
                                            (track: any, index: number) => (
                                                <>
                                                    <motion.div
                                                        key={track.id}
                                                        className="bg-transparent hover:bg-bunker-800/60 md:rounded-xl transition-all duration-200 ease-in-out grid grid-cols-6 gap-4 gap-y-2 cursor-pointer"
                                                        onClick={() =>
                                                            setOpenComment(
                                                                openComment ===
                                                                    track.id
                                                                    ? null
                                                                    : track.id
                                                            )
                                                        }
                                                        initial={{
                                                            height: "auto",
                                                        }}
                                                        // animate={{
                                                        //     height:
                                                        //         openComment ===
                                                        //         track.id
                                                        //             ? "300px"
                                                        //             : "auto",
                                                        //     // opacity: isExpanded ? 1 : 0.9,
                                                        // }}
                                                        transition={{
                                                            type: "spring", // Usa spring para um efeito mais fluido
                                                            stiffness: 200, // Controla a rigidez da mola
                                                            damping: 20, // Controla o amortecimento (quanto menor, mais "pulante")
                                                            bounce: 0.3, // Adiciona o efeito de "overshoot"
                                                            duration: 0.5, // Duração da animação
                                                        }}
                                                    >
                                                        <span className="flex items-center pl-5 py-4 text-bunker-300 text-xs col-span-1">
                                                            {track.track_number}
                                                        </span>
                                                        <div className="flex items-center px-2 py-4  col-span-4">
                                                            <div className="flex flex-col">
                                                                <h2 className="text-sm font-semibold flex flex-row gap-1 items-center">
                                                                    {track.explicit ? (
                                                                        <BsExplicitFill className="text-bunker-500 size-3" />
                                                                    ) : null}
                                                                    {track.name}
                                                                </h2>
                                                                <p className="text-xs text-bunker-300">
                                                                    {track.artists.map(
                                                                        (
                                                                            artist: any,
                                                                            index: number
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    artist.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    artist.name
                                                                                }
                                                                                {index <
                                                                                    track
                                                                                        .artists
                                                                                        .length -
                                                                                        1 &&
                                                                                    ", "}
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="flex items-center justify-end px-4 pr-5 py-4 text-end font-semibold col-start-6">
                                                            {
                                                                ratings.find(
                                                                    (rating) =>
                                                                        rating.id ===
                                                                        track.id
                                                                )?.value
                                                            }
                                                        </span>
                                                        <AnimatePresence>
                                                            {openComment === track.id &&
                                                                ratings.find((rating) => rating.id === track.id && rating.comment) && (
                                                                    <motion.div
                                                                        initial={{
                                                                            opacity: 0,
                                                                            scale: 0.95,
                                                                        }}
                                                                        animate={{
                                                                            opacity: 1,
                                                                            scale: 1,
                                                                        }}
                                                                        exit={{
                                                                            opacity: 0,
                                                                            scale: 0.95,
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.3,
                                                                        }}
                                                                        className=" font-semibold col-span-4 col-start-2 row-start-2 mb-4"
                                                                    >
                                                                        <div className="p-3 w-full flex flex-col gap-3 bg-bunker-800 rounded-xl">
                                                                            <div className="w-full flex flex-row gap-2 items-center">
                                                                                <div className="flex relative flex-col justify-center items-center size-7">
                                                                                    <Avatar
                                                                                        size={28}
                                                                                        src={rate.profiles.avatar_url}
                                                                                        className={"size-7"}
                                                                                        isIcon
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col items-start justify-center">
                                                                                    <div className="flex flex-row justify-start items-center gap-2 text-xs">
                                                                                        <p className=" font-medium flex flex-row items-center gap-1">
                                                                                            {rate.profiles.name}
                                                                                            {rate.profiles.verified && (
                                                                                                <TbRosetteDiscountCheckFilled className="size-4 text-main-500" />
                                                                                            )}
                                                                                        </p>
                                                                                        <p className="text-bunker-300 text-xs">
                                                                                            @{rate.profiles.username}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="w-full text-sm z-10">
                                                                                <p className="font-normal">
                                                                                    {
                                                                                        ratings.find(
                                                                                            (rating) =>
                                                                                                rating.id === track.id && rating.comment
                                                                                        )?.comment
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                </>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : null}
        </div>
    );
}
