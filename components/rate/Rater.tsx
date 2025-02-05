import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Slider, Chip, Textarea } from "@mantine/core";
import classes from "./Rater.module.css";

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
                                font-bold max-w-[37px] text-xl
                                
                            `}
                        value={value === 0 ? "" : value}
                        max={100}
                        min={0}
                        placeholder="0"
                        onChange={handleChange}
                    />
                    /100
                </div>
                <Chip
                    checked={favorite}
                    color="#fa805e"
                    onChange={(checked) => {
                        setFavorite(checked);
                        onValueChange(track.id, value, checked);
                        console.log(favorite);
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
                .select("ratings, review")
                .eq("user_id", user.id)
                .eq("album_id", albumId);

            if (error) {
                console.error("Error fetching ratings", error);
                return;
            }

            if (data.length > 0) {
                const { ratings, review } = data[0];
                // console.log(ratings)
                setRatings(ratings);
                setReview(review);
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
        // console.log("Total", cumulativeRating);
        const parsedRatings = cumulativeRating / ratings.length;
        // console.log("Parsed", parsedRatings);

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
            console.log("User already rated this album");
            const { data, error } = await supabase
                .from("ratings")
                .update([
                    {
                        album_id: albumId,
                        user_id: user.id,
                        ratings,
                        review,
                        total: parsedRatings,
                    },
                ])
                .eq("user_id", user.id)
                .eq("album_id", albumId);

            if (error) {
                console.error("Error saving ratings", error);
                return;
            }

            console.log("Ratings updated", data);
        } else {
            const { data, error } = await supabase.from("ratings").insert([
                {
                    album_id: albumId,
                    user_id: user.id,
                    ratings,
                    review,
                    total: parsedRatings,
                },
            ]);

            if (error) {
                console.error("Error saving ratings", error);
                return;
            }

            console.log("Ratings saved", data);
        }
    };

    return (
        <div className=" w-full px-5">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {tracks.map((track) => (
                    <Track
                        key={track.id}
                        track={track}
                        ratings={ratings}
                        onValueChange={handleValueChange}
                    />
                ))}
                <Textarea
                    label="Deixe sua avaliação"
                    autosize
                    minRows={2}
                    maxRows={4}
                    name="review"
                    placeholder="Qual sua opinião sobre o álbum?"
                    classNames={{
                        input: "!bg-neutral-700 !text-white !border-neutral-700",
                    }}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <button className="bg-orange-400 text-white font-bold rounded-xl py-3" type="submit">Salvar avaliação</button>
            </form>
        </div>
    );
}
