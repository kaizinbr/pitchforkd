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
            <h2 className="text-xl font-bold flex px-5 mb-3">Avaliações</h2>
            <div
                className={`
                    flex flex-col
                    w-full divide-bunker-800 divide-y
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
                        flex justify-center items-center py-2 mx-5 
                        rounded-xl text-center !font-medium 
                        bg-main-500 border-2 border-main-500 
                        hover:bg-main-600 hover:border-main-600 
                        cursor-pointer mt-6
                        transition-all duration-200
                    `}
            >
                    Carregar mais
                </button>
            )}
        </div>
    );
}
