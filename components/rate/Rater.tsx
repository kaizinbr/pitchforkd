import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

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

    return (
        <div>
            <h1>{track.name}</h1>
            <h2>{track.artists[0].name}</h2>
            <input
                type="range"
                min="0"
                max="100"
                step="5"
                defaultValue={value}
                onChange={handleChange}
            />
            <span>{value}</span>
            <input
                type="checkbox"
                checked={favorite}
                onChange={(e) => {
                    setFavorite(e.target.checked);
                    onValueChange(track.id, value, e.target.checked);
                    console.log(favorite);
                }}
            />
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

        const cumulativeRating = ratings.reduce((acc, rating) => acc + rating.value, 0);
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
        <div>
            <h2>Avalie as músicas</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {tracks.map((track) => (
                    <Track
                        key={track.id}
                        track={track}
                        ratings={ratings}
                        onValueChange={handleValueChange}
                    />
                ))}
                <textarea
                    className={`
                            bg-neutral-700
                        `}
                    name="review"
                    placeholder="Qual sua opinião sobre o álbum?"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <button type="submit">Save Ratings</button>
            </form>
        </div>
    );
}
