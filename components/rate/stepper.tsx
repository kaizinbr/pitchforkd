import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Slider, Chip, Textarea } from "@mantine/core";
import classes from "./Rater.module.css";

import TextareaEditor from "./textarea-editor";

import { Album } from "@/lib/utils/types";
import Image from "next/image";

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
        comment: string
    ) => void;
    ratings: {
        id: string;
        value: number;
        favorite: boolean;
        comment?: string;
    }[];
}) => {
    const [value, setValue] = useState<number>(0);
    const [favorite, setFavorite] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");

    useEffect(() => {
        const rating = ratings.find((rating) => rating.id === track.id);
        if (rating) {
            setValue(rating.value);
            setFavorite(rating.favorite);
            setComment(rating.comment || "");
        }
    }, [ratings, track.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setValue(newValue);
        onValueChange(track.id, newValue, favorite, comment);
        // console.log(favorite);
    };

    const handleSliderChange = (newValue: number) => {
        setValue(newValue);
        console.log(newValue);
        onValueChange(track.id, newValue, favorite, comment);
        // console.log(favorite, track.id);
    };

    return (
        <div
            className={`
             gap-4 w-full
            flex flex-col items- justify-center
        `}
        >
            <div className="flex flex-col">
                <h1 className="font-medium">{track.name}</h1>
            </div>
            <div className="flex flex-col gap-4 w-full">
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
                <div className="flex flex-row items-end">
                    <input
                        type="number"
                        name="value"
                        id="value"
                        className={`
                                bg-transparent outline-none
                                !font-bold text-xl
                                
                            `}
                        value={value === 0 ? "" : value}
                        max={100}
                        min={0}
                        placeholder="0"
                        onChange={handleChange}
                    />
                </div>
                {/* <Chip
                    checked={favorite}
                    color="#fa805e"
                    onChange={(checked) => {
                        setFavorite(checked);
                        onValueChange(track.id, value, checked, comment);
                        console.log(favorite);
                    }}
                    classNames={{
                        label: classes.label,
                    }}
                >
                    Favorita
                </Chip> */}
                <div className="flex flex-col gap-2">
                    {/* <h1 className="font-medium">Deixe sua avaliação aqui</h1> */}
                    <Textarea
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            onValueChange(
                                track.id,
                                value,
                                favorite,
                                e.target.value
                            );
                        }}
                        placeholder="Deixe um comentário"
                        classNames={{
                            root: "!bg-bunker-700 !text-white !border-bunker-700 !rounded-xl",
                            input: "!bg-bunker-700 !text-white !border-bunker-700 !rounded-xl",
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
    setCurrentTrack
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
        }[]
    ) => void;
    setFinalTotal: (total: number) => void;
    setCurrentTrack: (track: string) => void;
    // setContent: (content: any) => void;
}) {
    const supabase = createClient();
    const tracks = album.tracks.items;

    const [active, setActive] = useState(0);
    const [ratings, setRatings] = useState<
        { id: string; value: number; favorite: boolean; comment?: string }[]
    >([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        // check if user already rated the album
        // if so, load the ratings
        const fetchRatings = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                console.error("User not logged in");
                return;
            }

            const { data, error } = await supabase
                .from("ratings")
                .select("ratings, review, total, shorten, content")
                .eq("user_id", user.id)
                .eq("album_id", album.id);

            if (error) {
                console.error("Error fetching ratings", error);
                return;
            }

            // Primeiro, tenta carregar do sessionStorage
            const sessionRatings = tracks.map((track) => {
                const item = sessionStorage.getItem(track.id);
                return item
                    ? JSON.parse(item)
                    : null;
            });

            const hasSessionRatings = sessionRatings.some(rating => rating !== null);

            if (hasSessionRatings) {
                // Se encontrou algum rating no sessionStorage, usa eles
                const filledRatings = tracks.map((track, idx) =>
                    sessionRatings[idx] !== null
                        ? sessionRatings[idx]
                        : {
                              id: track.id,
                              value: 0,
                              favorite: false,
                              comment: "",
                          }
                );
                setRatings(filledRatings);
                const soma = filledRatings.reduce((acc, rating) => acc + rating.value, 0);
                const finalTotal = soma / filledRatings.length;
                setTotal(finalTotal);
            } else if (data.length > 0) {
                // Se não tem no session, tenta do banco
                const { ratings, total } = data[0];
                // Salva cada rating individual no session
                ratings.forEach((rating: any) => {
                    sessionStorage.setItem(rating.id, JSON.stringify(rating));
                });

                setRatings(ratings);
                setTotal(parseFloat(total.toFixed(1).replace(",", ".")));
            } else {
                // Se não tem em nenhum lugar, inicializa zerado
                const emptyRatings = tracks.map((track) => ({
                    id: track.id,
                    value: 0,
                    favorite: false,
                    comment: "",
                }));
                setRatings(emptyRatings);
            }
        };

        fetchRatings();
    }, [tracks]);

    const handleValueChange = (
        id: string,
        value: number,
        favorite: boolean,
        comment: string
    ) => {
        setRatings((prevRatings) =>
            prevRatings.map((rating) =>
                rating.id === id
                    ? { ...rating, value, favorite, comment }
                    : rating
            )
        );
        setTotal(
            ratings.reduce((acc, rating) => acc + rating.value, 0) /
                ratings.length
        );
        console.log("Ratings:", ratings);
        console.log("Total:", total);

        sessionStorage.setItem(
            id,
            JSON.stringify({
                id: id,
                value: value,
                favorite: favorite,
                comment: comment,
            })
        );
    };

    const nextStep = () =>
        setActive((current) =>
            current < tracks.length - 1 ? current + 1 : current

        );
    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    const currentTrack = tracks[active];

    useEffect(() => {
        if (currentTrack && setCurrentTrack) {
            setCurrentTrack(currentTrack.id);
        }
    }, [active, currentTrack, setCurrentTrack]);

    console.log("Current Track:", tracks);

    console.log("Ratings:", ratings);
    // console.log("Total:", total);

    return (
        <div className="flex flex-col gap-4 items-center relative w-full max-w-2xl">
            {/* <h2>{album.name}</h2> */}
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-row gap-2 w-full">
                    {/* tracks={album.tracks.items} albumId={album.id} albumImg={album.images[0]?.url} */}
                    <Image
                        src={album.images[0].url}
                        alt="Album"
                        width={60}
                        height={60}
                        className="rounded-xl"
                    />
                    <div className="flex flex-col justify-center">
                        <h1 className="font-medium">{currentTrack.name}</h1>
                        <p className="text-sm text-bunker-300">
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
                                )
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
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={prevStep}
                        disabled={active === 0}
                        className={`
                                bg-bunker-700 hover:bg-bunker-700/80 transition-all duration-200 
                                !font-semibold py-2 px-3 rounded-lg 
                                cursor-pointer disabled:cursor-not-allowed
                                disabled:opacity-50 disabled:hover:bg-bunker-700
                            `}
                    >
                        Voltar
                    </button>
                    <button
                        onClick={() => {
                            if (active === tracks.length - 1) {
                                // Finalizar
                                console.log("Finalizar");

                                const sessionRatings = tracks.map((track) => {
                                    const item = sessionStorage.getItem(
                                        track.id
                                    );
                                    return item
                                        ? JSON.parse(item)
                                        : {
                                              id: track.id,
                                              value: 0,
                                              favorite: false,
                                              comment: "",
                                          };
                                });
                                console.log("Session Ratings:", sessionRatings);
                                setFinalRatings(sessionRatings);
                                setRatings(sessionRatings);

                                const soma = sessionRatings.reduce(
                                    (acc, rating) => acc + rating.value,
                                    0
                                );
                                const finalTotal = soma / sessionRatings.length;
                                console.log("Final Total:", finalTotal);
                                setTotal(finalTotal);
                                setFinalTotal(finalTotal);

                                

                                setOnTracks(false);
                            } else {
                                nextStep();
                            }
                        }}
                        // disabled={active === tracks.length - 1}
                        className={`
                            
                                transition-all duration-200 py-2 px-3 !font-semibold
                                rounded-lg cursor-pointer disabled:cursor-not-allowed
                                ${active === tracks.length - 1 ? " bg-main-500 hover:bg-main-600 " : "bg-blue-celestial hover:bg-blue-celestial/80 "}
                            `}
                    >
                        {active === tracks.length - 1 ? "Finalizar" : "Próximo"}
                    </button>
                </div>
                <p className="text-sm text-white/70">
                    Música {active + 1} de {tracks.length}
                </p>
            </div>
        </div>
    );
}
