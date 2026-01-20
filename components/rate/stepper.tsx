import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Slider, Chip, Textarea } from "@mantine/core";
import classes from "./Rater.module.css";

import TextareaEditor from "./textarea-editor";

import { Album } from "@/lib/utils/types";
import Image from "next/image";
import { skip } from "@prisma/client/runtime/client";

type Track2 = {
    id: string;
    title: string;
    name: string;
};

type Props = {
    album: Album;
    onRate: (trackId: string, rating: number) => void;
    setOnTracks: (checked: boolean) => void;
};

const Track = ({
    track,
    onValueChange,
    ratings,
}: {
    track: any;
    onValueChange: (
        id: string,
        value: number,
        favorite: boolean,
        comment: string,
        skip?: boolean,
    ) => void;
    ratings: {
        id: string;
        value: number;
        favorite: boolean;
        comment?: string;
        skip?: boolean;
    }[];
}) => {
    const [value, setValue] = useState<number>(0);
    const [favorite, setFavorite] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [skip, setSkip] = useState<boolean>(false);

    useEffect(() => {
        const rating = ratings.find((rating) => rating.id === track.id);
        if (rating) {
            setValue(rating.value);
            setFavorite(rating.favorite);
            setComment(rating.comment || "");
            setSkip(rating.skip || false);
            console.log("Loaded rating for track:", track.id, rating);
        }
    }, [ratings, track.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);

        if (newValue > 100) {
            setValue(100);
            onValueChange(track.id, 100, favorite, comment, skip);
            return;
        }
        if (newValue <= 0) {
            setValue(0);
            onValueChange(track.id, 0, favorite, comment, skip);
            return;
        }
        setValue(newValue);
        console.log(newValue);
        onValueChange(track.id, newValue, favorite, comment, skip);
        // console.log(favorite);
    };

    const handleSliderChange = (newValue: number) => {
        if (newValue > 100) {
            setValue(100);
            onValueChange(track.id, 100, favorite, comment, skip);
            return;
        }
        if (newValue < 0) {
            setValue(0);
            onValueChange(track.id, 0, favorite, comment, skip);
            return;
        }
        setValue(newValue);
        console.log(newValue);
        onValueChange(track.id, newValue, favorite, comment, skip);
        // console.log(favorite, track.id);
    };

    return (
        <div
            className={`
             gap-4 w-full
            flex flex-col items- justify-center
        `}
        >
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-row items-end">
                    <input
                        type="number"
                        name="value"
                        id="value"
                        className={`
                                bg-transparent outline-none
                                !font-bold! !text-3xl!
                                
                            `}
                        value={value === 0 ? "" : value}
                        max={100}
                        min={0}
                        placeholder="0"
                        onChange={handleChange}
                    />
                </div>
                <Slider
                    value={value}
                    onChange={handleSliderChange}
                    step={1}
                    classNames={{
                        root: classes.root,
                        track: classes.track,
                        bar: classes.bar,
                        thumb: classes.thumb,
                    }}
                />
                <div className="flex flex-col gap-2">
                    <Textarea
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            onValueChange(
                                track.id,
                                value,
                                favorite,
                                e.target.value,
                            );
                        }}
                        placeholder="Deixe um comentário"
                        classNames={{
                            root: "!bg-shark-800 !text-white !border-shark-700 !rounded-xl",
                            input: "!bg-shark-800 !text-white !border-shark-700 !rounded-xl",
                        }}
                        autosize
                        minRows={2}
                        maxRows={6}
                        styles={{
                            root: {
                                backgroundColor: "#1f2937",
                                borderRadius: "0.5rem",
                            },
                            input: {
                                backgroundColor: "#1f2937",
                                color: "#fff",
                            },
                            label: {
                                color: "#fff",
                            },
                        }}
                    />
                </div>
                <Chip
                    checked={skip}
                    color="#fa805e"
                    onChange={(checked) => {
                        setSkip(checked);
                        console.log("Skip:", checked);
                        onValueChange(
                            track.id,
                            value,
                            favorite,
                            comment,
                            checked,
                        );
                    }}
                    classNames={{
                        label: classes.label,
                    }}
                >
                    Pular
                </Chip>
            </div>
        </div>
    );
};

export default function TrackStepper({
    album,
    onRate,
    setOnTracks,
    setFinalRatings,
    setFinalTotal,
    setCurrentTrack,
    active,
    setActive,
    ratings,
    useMedia,
}: {
    album: Album;
    onRate: (trackId: string, rating: number) => void;
    setOnTracks: (checked: boolean) => void;
    setFinalRatings: (
        ratings: {
            id: string;
            value: number;
            favorite: boolean;
            comment?: string;
            skip?: boolean;
        }[],
    ) => void;
    setFinalTotal: (total: number) => void;
    setCurrentTrack: (track: string) => void;
    active: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
    ratings: {
        id: string;
        value: number;
        favorite: boolean;
        comment?: string;
        skip?: boolean;
    }[];
    useMedia: boolean;
}) {
    const tracks = album.tracks.items;

    const [ratings2, setRatings] = useState<
        {
            id: string;
            value: number;
            favorite: boolean;
            comment?: string;
            skip?: boolean;
        }[]
    >([]);
    const [total, setTotal] = useState<number>(0);

    const handleValueChange = (
        id: string,
        value: number,
        favorite: boolean,
        comment: string,
        skip?: boolean,
    ) => {
        setRatings((prevRatings) => {
            const existingRatingIndex = prevRatings.findIndex(
                (rating) => rating.id === id,
            );
            if (existingRatingIndex !== -1) {
                const updatedRatings = [...prevRatings];
                updatedRatings[existingRatingIndex] = {
                    id,
                    value,
                    favorite,
                    comment,
                    skip,
                };
                return updatedRatings;
            } else {
                return [...prevRatings, { id, value, favorite, comment, skip }];
            }
        });

        const ratings2 = [...ratings];
        const existingRatingIndex = ratings2.findIndex(
            (rating) => rating.id === id,
        );

        if (existingRatingIndex !== -1) {
            ratings2[existingRatingIndex] = {
                id,
                value,
                favorite,
                comment,
                skip,
            };
        } else {
            ratings2.push({ id, value, favorite, comment, skip });
        }

        setFinalRatings(ratings2);
        if (useMedia) {
            const finalTotal =
                ratings2.reduce(
                    (acc, rating) => acc + (rating.skip ? 0 : rating.value),
                    0,
                ) / ratings2.filter((r) => !r.skip).length;
            if (finalTotal < 100 && finalTotal > 0) {
                const formattedTotal = finalTotal % 1 !== 0 ? finalTotal.toFixed(2) : finalTotal;
                setTotal(formattedTotal as unknown as number);
                setFinalTotal(formattedTotal as unknown as number);
            } else {
                setTotal(finalTotal);
                setFinalTotal(finalTotal);
            }
        }

        sessionStorage.setItem(
            id,
            JSON.stringify({
                id: id,
                value: value,
                favorite: favorite,
                comment: comment,
                skip: skip,
            }),
        );
    };

    const nextStep = () =>
        setActive((current) =>
            current < tracks.length - 1 ? current + 1 : current,
        );
    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    const currentTrack = tracks[active];

    useEffect(() => {
        if (currentTrack && setCurrentTrack) {
            setCurrentTrack(currentTrack.id);
        }
    }, [active, currentTrack, setCurrentTrack]);

    // console.log("Current Track:", tracks);

    // console.log("Ratings:", ratings);
    // console.log("Total:", total);

    return (
        <div
            className={`
            flex flex-col gap-4 items-center relative w-full max-w-2xl
            
                                    bg-shark-900
                                   p-4
                                    rounded-xl
                                   items- justify-center
        `}
        >
            <div className="flex flex-col gap-4 w-full">
                <h2>Músicas</h2>
                <div className="flex flex-row gap-2 w-full">
                    <Image
                        src={album.images[0].url}
                        alt="Album"
                        width={64}
                        height={64}
                        className="rounded-md max-h-16 max-w-16 object-cover object-center"
                    />
                    <div className="flex flex-col justify-center">
                        <h1 className="font-medium">{currentTrack.name}</h1>
                        <p className="text-sm text-shark-300">
                            {currentTrack.artists.map(
                                (artist: any, index: number) => (
                                    <span
                                        key={artist.id}
                                        className="font-medium"
                                    >
                                        {artist.name}
                                        {index <
                                            currentTrack.artists.length - 1 &&
                                            ", "}
                                    </span>
                                ),
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 w-full">
                    <Track
                        key={currentTrack.id}
                        track={currentTrack}
                        ratings={ratings}
                        onValueChange={handleValueChange}
                    />
                </div>
                <div className="flex flex-row justify-between items-end">
                    <p className="text-sm text-white/70">
                        Música {active + 1} de {tracks.length}
                    </p>
                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={prevStep}
                            disabled={active === 0}
                            className={`
                                    bg-shark-800 hover:bg-shark-800/80 transition-all duration-200
                                    !font-semibold! py-2 px-3 rounded-xl
                                    cursor-pointer disabled:cursor-not-allowed
                                    disabled:opacity-50 disabled:hover:bg-shark-800
                                `}
                        >
                            Voltar
                        </button>
                        <button
                            onClick={() => {
                                if (active === tracks.length - 1) {
                                    // Finalizar
                                    console.log("Finalizar");
                                    const sessionRatings = tracks.map(
                                        (track) => {
                                            const item = sessionStorage.getItem(
                                                track.id,
                                            );
                                            return item
                                                ? JSON.parse(item)
                                                : {
                                                      id: track.id,
                                                      value: 0,
                                                      favorite: false,
                                                      comment: "",
                                                  };
                                        },
                                    );
                                    console.log(
                                        "Session Ratings:",
                                        sessionRatings,
                                    );
                                    setFinalRatings(sessionRatings);
                                    setRatings(sessionRatings);
                                    const soma = sessionRatings.reduce(
                                        (acc, rating) => acc + rating.value,
                                        0,
                                    );
                                    const finalTotal =
                                        soma / sessionRatings.length;
                                    console.log("Final Total:", finalTotal);
                                    setTotal(finalTotal);
                                    setFinalTotal(finalTotal);

                                    setOnTracks(false);
                                    setCurrentTrack("");
                                } else {
                                    nextStep();
                                }
                            }}
                            disabled={active === tracks.length - 1}
                            className={`
                    
                                    transition-all duration-200 py-2 px-3 !font-semibold
                                    rounded-xl cursor-pointer disabled:cursor-not-allowed
                                    bg-malachite-600 hover:bg-malachite-700

                                    disabled:opacity-50 disabled:hover:bg-malachite-600
                                `}
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
