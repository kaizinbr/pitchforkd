import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Slider, Chip, Textarea } from "@mantine/core";
import classes from "./Rater.module.css";
import getShorten from "@/lib/utils/getShorten";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import Link from "next/link";

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
    const [checked, setChecked] = useState(false);

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
            bg-neutral-700
            p-4 gap-4
            rounded-xl
            flex flex-col items- justify-center
        `}
        >
            <div className="flex flex-col">
                <h1 className="font-bold">{track.name}</h1>
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
                                font-bold text-xl
                                
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

export default function Rater({
    tracks,
    albumId,
}: {
    tracks: any[];
    albumId: string;
}) {
    const supabase = createClient();
    const [ratings, setRatings] = useState<
        { id: string; value: number; favorite: boolean }[]
    >([]);
    const [review, setReview] = useState<string>("");
    const [total, setTotal] = useState<number>(0);
    const [shorten, setShorten] = useState<string>("");
    const [useMedia, setUseMedia] = useState<boolean>(true);
    const [opened, { open, close }] = useDisclosure(false);

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
                .select("ratings, review, total, shorten")
                .eq("user_id", user.id)
                .eq("album_id", albumId);

            if (error) {
                console.error("Error fetching ratings", error);
                return;
            }

            if (data.length > 0) {
                const { ratings, review, total } = data[0];
                console.log(total);
                setRatings(ratings);
                setReview(review);
                setShorten(data[0].shorten);
                setTotal(parseFloat(total.toFixed(1).replace(",", ".")));
            } else {
                const initialRatings = tracks.map((track) => ({
                    id: track.id,
                    value: 0,
                    favorite: false,
                }));
                setRatings(initialRatings);
            }
        };

        fetchRatings();

        // const initialRatings = tracks.map((track) => ({
        //     id: track.id,
        //     value: 0,
        //     favorite: false,
        // }));
        // setRatings(initialRatings);
    }, [tracks]);

    const handleValueChange = (
        id: string,
        value: number,
        favorite: boolean
    ) => {
        setRatings((prevRatings) =>
            prevRatings.map((rating) =>
                rating.id === id ? { ...rating, value, favorite } : rating
            )
        );
    };

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
            .eq("album_id", albumId);

        if (ratingsError) {
            console.error("Error fetching ratings", ratingsError);
            return;
        }

        if (ratingsData.length > 0) {
            console.log("User already rated this album", finalRating);
            const { data, error } = await supabase
                .from("ratings")
                .update([
                    {
                        album_id: albumId,
                        user_id: user.id,
                        ratings,
                        review,
                        total: finalRating,
                    },
                ])
                .eq("user_id", user.id)
                .eq("album_id", albumId);

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
                    album_id: albumId,
                    user_id: user.id,
                    ratings,
                    review,
                    total: finalRating,
                    shorten: shortened,
                },
            ]);

            if (error) {
                console.error("Error saving ratings", error);
                return;
            }

            console.log("Ratings saved", data);
            open();
        }
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
                }}
            >
                <div className="w-full flex flex-col items-center gap-3">
                    <h2 className="text-2xl font-bold">Avaliação salva!</h2>
                    <button
                        className="bg-orange-600 cursor-pointer text-white rounded-xl py-2 px-6"
                        onClick={close}
                    >
                        Continuar avaliando
                    </button>
                    <Link
                        href={`/r/${shorten}`}
                        className="bg-orange-600 cursor-pointer text-white rounded-xl py-2 px-6"
                    >
                        Ver avaliação
                    </Link>
                    
                    <Link
                        href={`/r/${shorten}/share`}
                        className="bg-orange-600 cursor-pointer text-white rounded-xl py-2 px-6"
                    >
                        Compartilhar avaliação
                    </Link>
                </div>
            </Modal>
            <div className=" w-full max-w-2xl px-5">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                        bg-neutral-700
                        p-4 gap-4
                        rounded-xl
                        flex flex-col items- justify-center
                    `}
                    >
                        <h2 className="font-bold">Sua avaliação do álbum</h2>
                        <input
                            type="number"
                            name="total"
                            id="total"
                            className={`
                                    bg-transparent outline-none
                                    font-bold w-full text-2xl
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
                            Usar média
                        </Chip>
                    </div>
                    <Textarea
                        label="Deixe sua avaliação"
                        autosize
                        minRows={5}
                        maxRows={8}
                        name="review"
                        placeholder="Qual sua opinião sobre o álbum?"
                        classNames={{
                            input: "!bg-neutral-700 !text-white !border-neutral-700 !rounded-xl",
                        }}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                    <button
                        className="bg-orange-600 cursor-pointer text-white font-bold rounded-xl py-3"
                        type="submit"
                    >
                        Salvar avaliação
                    </button>
                </form>
            </div>
        </>
    );
}
