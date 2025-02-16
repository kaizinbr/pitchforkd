"use client";
import RatingCard from "../user/RatingCard";
import { useState } from "react";
import { Review } from "@/lib/utils/types";
import { createClient } from "@/utils/supabase/client";

export default function DisplayReviews({
    ratings,
    ratingsLength,
}: {
    ratings: Review[] | null;
    ratingsLength: number;
}) {
    console.log(ratingsLength);
    const supabase = createClient();
    const [offset, setOffset] = useState(30);

    const ratingsList = ratings;

    const handleLoadMore = async () => {
        const { data, error } = await (
            await supabase
        )
            .from("ratings")
            .select(
                `*,
                profiles(
                    *
                )`
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + 29);

        setOffset(offset + 30);
        if (ratingsList && data) {
            ratingsList.push(...data);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-2xl">
            <h2 className="text-xl font-bold flex px-5">Reviews</h2>
            <div
                className={`
                    flex flex-col
                    w-full
                `}
            >
                {ratings?.map((rating) => (
                    <RatingCard key={rating.id} review={rating} />
                ))}
            </div>
            {ratingsLength > 5 && ratings && ratings.length < ratingsLength && (
                <button
                    onClick={handleLoadMore}
                    className={`
                        flex justify-center items-center py-2 mx-5 rounded-xl 
                        bg-orange-600 hover:bg-orange-400 transition-all duration-200 cursor-pointer 
                        text-white font-bold
                    `}
            >
                    Carregar mais
                </button>
            )}
        </div>
    );
}
