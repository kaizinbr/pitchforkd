import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Slider, Chip, Textarea } from "@mantine/core";
import classes from "./Rater.module.css";
import getShorten from "@/lib/utils/getShorten";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import Link from "next/link";

import TextareaEditor from "./textarea-editor";
import TrackStepper from "@/components/rate/stepper";

import { Album } from "@/lib/utils/types";

const Track = ({
    track,
    onValueChange,
    ratings,
}: {
    track: any;
    onValueChange: (id: string, value: number, favorite: boolean) => void;
    ratings: { id: string; value: number; favorite: boolean }[];
}) => {
    const [value, setValue] = useState<number>(0);
    const [favorite, setFavorite] = useState<boolean>(false);

    useEffect(() => {
        const rating = ratings.find((rating) => rating.id === track.id);
        if (rating) {
            setValue(rating.value);
            setFavorite(rating.favorite);
        }
    }, [ratings, track.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setValue(newValue);
        onValueChange(track.id, newValue, favorite);
        // console.log(favorite);
    };

    const handleSliderChange = (newValue: number) => {
        setValue(newValue);
        onValueChange(track.id, newValue, favorite);
    };

    return (
        <div
            className={`
            bg-shark-800
            p-4 gap-4
            rounded-xl w-full
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
                    step={5}
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
                <Chip
                    checked={favorite}
                    color="#fa805e"
                    onChange={(checked) => {
                        setFavorite(checked);
                        onValueChange(track.id, value, checked);
                        console.log(favorite);
                    }}
                    classNames={{
                        label: classes.label,
                    }}
                >
                    Favorita
                </Chip>
            </div>
        </div>
    );
};

export { Track };

export default function Rater({
    album,
    setCurrentTrack,
    tracks,
    ratings,
    setRatings,
    active,
    setActive
}: {
    album: Album;
    setCurrentTrack: (track: string) => void;
    tracks: any[];
    ratings: { id: string; value: number; favorite: boolean; comment?: string }[];
    setRatings: React.Dispatch<React.SetStateAction<{ id: string; value: number; favorite: boolean; comment?: string }[]>>;
    active: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
}) {
    const supabase = createClient();

    const [onTracks, setOnTracks] = useState<boolean>(true);

    const [review, setReview] = useState<string>("");
    const [total, setTotal] = useState<number>(0);
    const [shorten, setShorten] = useState<string>("");
    const [useMedia, setUseMedia] = useState<boolean>(true);
    const [opened, { open, close }] = useDisclosure(false);
    const [content, setContent] = useState<any>(null);

    const [rawText, setRawText] = useState<string>("");
    const [jsonContent, setJsonContent] = useState<any>({
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    {
                        text: "",
                        type: "text",
                    },
                ],
            },
        ],
    });

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

            if (data.length > 0) {
                // ja avaliou
                const { ratings, review, total } = data[0];
                setContent(data[0].content);
                setJsonContent(data[0].content);
                console.log("Ratings fetched", jsonContent);

                setRatings(ratings);
                setReview(review);
                setRawText(review);
                setShorten(data[0].shorten);
                setTotal(parseFloat(total.toFixed(1).replace(",", ".")));
            } else {
                //nao avaliou
                const initialRatings = tracks.map((track) => ({
                    id: track.id,
                    value: 0,
                    favorite: false,
                }));
                setRatings(initialRatings);
                setContent({
                    type: "doc",
                    content: [
                        {
                            type: "paragraph",
                            content: [{ text: "", type: "text" }],
                        },
                    ],
                });
            }
        };

        fetchRatings();
    }, [tracks]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(ratings);

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            console.error("User not logged in");
            return;
        }

        const cumulativeRating = ratings.reduce(
            (acc, rating) => acc + rating.value,
            0
        );

        let finalRating;
        if (useMedia) {
            finalRating = cumulativeRating / ratings.length;
        } else {
            finalRating = total;
        }

        // verifica se o usuario já avaliou o album
        const { data: ratingsData, error: ratingsError } = await supabase
            .from("ratings")
            .select("id")
            .eq("user_id", user.id)
            .eq("album_id", album.id);

        if (ratingsError) {
            console.error("Error fetching ratings", ratingsError);
            return;
        }

        if (ratingsData.length > 0) {
            console.log("User already rated this album", finalRating);
            console.log("Ratings to update", jsonContent);

            const { data, error } = await supabase
                .from("ratings")
                .update([
                    {
                        album_id: album.id,
                        user_id: user.id,
                        ratings,
                        review: rawText,
                        content: jsonContent,
                        total: finalRating,
                        is_published: true,
                    },
                ])
                .eq("user_id", user.id)
                .eq("album_id", album.id);

            if (error) {
                console.error("Error saving ratings", error);
                return;
            }

            console.log("Ratings updated", data);
            open();
        } else {
            const shortened = getShorten();
            setShorten(shortened);

            const { data, error } = await supabase.from("ratings").insert([
                {
                    album_id: album.id,
                    user_id: user.id,
                    ratings,
                    review: rawText,
                    content: jsonContent,
                    total: finalRating,
                    shorten: shortened,
                    is_published: true,
                },
            ]);

            if (error) {
                console.error("Error saving ratings", error);
                return;
            }

            console.log("Ratings saved", data);
            open();
        }
        //limpar o session e evitar conflito
        tracks.forEach((track) => {
            sessionStorage.removeItem(track.id);
        });
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title=""
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                centered
                classNames={{
                    root: "!z-[1999]",
                    overlay: "!z-[1998]",
                    inner: "!z-[1999]",
                    content: "!bg-shark-800 !rounded-xl",
                    header: "!bg-shark-800 !rounded-xl",
                }}
            >
                <div className="w-full flex flex-col items-center gap-3 font-semibold">
                    <h2 className="text-2xl">Avaliação salva!</h2>
                    <button
                        className="bg-green-pastel cursor-pointer text-white rounded-xl py-2 px-6"
                        onClick={close}
                    >
                        Continuar avaliando
                    </button>
                    <Link
                        href={`/r/${shorten}`}
                        className="bg-orange-safety cursor-pointer text-white rounded-xl py-2 px-6"
                    >
                        Ver avaliação
                    </Link>

                    <Link
                        href={`/r/${shorten}/share`}
                        className="bg-blue-celestial cursor-pointer text-white rounded-xl py-2 px-6"
                    >
                        Compartilhar avaliação
                    </Link>
                </div>
            </Modal>
            <div className="w-full max-w-2xl mt-22 bg-shark-800 p-5 gap-4 rounded-xl">
                {onTracks ? (
                    <TrackStepper
                        album={album}
                        onRate={() => console.log("Rated")}
                        setCurrentTrack={setCurrentTrack}
                        setOnTracks={setOnTracks}
                        setFinalRatings={setRatings}
                        setFinalTotal={setTotal}
                        active={active}
                        setActive={setActive}
                    />
                ) : (
                    <div className="flex flex-col gap-4 w-full">
                        <div
                            className={`
                        bg-shark-800
                         gap-2
                        rounded-xl
                        flex flex-col items- justify-center
                    `}
                        >
                            <h2 className="font-medium">Total do álbum</h2>
                            <input
                                type="number"
                                name="total"
                                id="total"
                                className={`
                                    bg-transparent outline-none
                                    !font-semibold w-full text-2xl
                                `}
                                value={total === 0 ? "" : total}
                                max={100}
                                min={0}
                                placeholder="0"
                                onChange={(e) =>
                                    setTotal(Number(e.target.value))
                                }
                                disabled={useMedia}
                            />
                            <Chip
                                checked={useMedia}
                                color="#fa805e"
                                onChange={(useMedia) => {
                                    setUseMedia(useMedia);
                                    setTotal(
                                        ratings.reduce(
                                            (acc, rating) => acc + rating.value,
                                            0
                                        ) / ratings.length
                                    );
                                    console.log(useMedia);
                                }}
                                classNames={{
                                    label: classes.label,
                                }}
                            >
                                Automático
                            </Chip>
                        </div>
                        <div className="flex flex-col gap-2 mt-3">
                            {content && (
                                <TextareaEditor
                                    content={content}
                                    setRawText={setRawText}
                                    setJsonContent={setJsonContent}
                                />
                            )}
                        </div>
                        <div className="flex flex-row w-full gap-4 justify-end">
                            <button
                                className={`
                                py-2 px-3
                                flex justify-center items-center
                                bg-shark-700 hover:bg-shark-700/80
                                text-white !font-semibold rounded-xl
                                cursor-pointer
                                transition-all duration-300
                                z-[500]
                            `}
                                type="button"
                                onClick={() => {
                                    setOnTracks(true);
                                }}
                            >
                                Voltar
                            </button>
                            {/* <button
                                className={`
                                py-2 px-3
                                flex justify-center items-center
                                bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600
                                text-white !font-semibold rounded-xl
                                cursor-pointer
                                transition-all duration-300
                                z-[500]
                            `}
                                type="submit"
                            >
                                Salvar rascunho
                            </button> */}
                            <button
                                className={`
                                py-2 px-3
                                flex justify-center items-center
                                bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600
                                text-white !font-semibold rounded-xl
                                cursor-pointer
                                transition-all duration-300
                                z-[500]
                            `}
                                type="button"
                                onClick={handleSubmit}
                            >
                                Publicar
                            </button>
                        </div>
                    </div>
                )}

                {/* <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {tracks.map((track) => (
                        <Track
                            key={track.id}
                            track={track}
                            ratings={ratings}
                            onValueChange={handleValueChange}
                        />
                    ))}
                    <div
                        className={`
                        bg-shark-800
                        p-4 gap-4
                        rounded-xl
                        flex flex-col items- justify-center
                    `}
                    >
                        <h2 className="font-medium">Sua avaliação do álbum</h2>
                        <input
                            type="number"
                            name="total"
                            id="total"
                            className={`
                                    bg-transparent outline-none
                                    !font-semibold w-full text-2xl
                                `}
                            value={total === 0 ? "" : total}
                            max={100}
                            min={0}
                            placeholder="0"
                            onChange={(e) => setTotal(Number(e.target.value))}
                            disabled={useMedia}
                        />
                        <Chip
                            checked={useMedia}
                            color="#fa805e"
                            onChange={(useMedia) => {
                                setUseMedia(useMedia);
                                setTotal(
                                    ratings.reduce(
                                        (acc, rating) => acc + rating.value,
                                        0
                                    ) / ratings.length
                                );
                                console.log(useMedia);
                            }}
                            classNames={{
                                label: classes.label,
                            }}
                        >
                            Automático
                        </Chip>
                    </div>
                    <div className="flex flex-col gap-2 mt-3">
                        <h1 className="font-medium">
                            Deixe sua avaliação aqui
                        </h1>
                        {content && (
                            <TextareaEditor
                                content={content}
                                setRawText={setRawText}
                                setJsonContent={setJsonContent}
                            />
                        )}
                    </div>
                    <button
                        className={`
                            py-3
                            flex justify-center items-center
                            bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600 
                            text-white !font-semibold rounded-xl
                            fixed left-4 right-4
                            max-w-2xl mx-auto
                            ${scrollDirection > "down" ? "bottom-20" : "bottom-4"}
                            md:bottom-4 cursor-pointer
                            transition-all duration-300
                            z-[500]
                        `}
                        type="submit"
                    >
                        Salvar avaliação
                    </button>
                </form> */}
            </div>
        </>
    );
}
