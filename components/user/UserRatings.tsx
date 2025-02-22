"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import RatingCard from "./RatingCard";
import { RatingCardSkeletonList } from "../Skeletons";

export default function UserRatings({ user }: { user: any }) {
    const [ratings, setRatings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(30);
    const [total, setTotal] = useState(0);

    const supabase = createClient();

    useEffect(() => {
        async function fetchRatings() {
            const { data, error } = await supabase
                .from("ratings")
                .select(
                    `*,
                    profiles(
                        *
                    )`
                )
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .range(0, 29);

            if (error) {
                console.error("Error fetching ratings", error);
            }

            const { data: total, error: totalError } = await supabase
                .from("ratings")
                .select(
                    `*,
                profiles(
                    *
                )`
                )
                .eq("user_id", user.id);

            if (totalError) {
                console.error("Error fetching ratings", totalError);
            }

            if (total) {
                setTotal(total.length);
            }

            console.log(data);
            setRatings(data!);
            setLoading(false);
        }

        fetchRatings();
    }, []);

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
        <div className="w-full flex flex-col gap-4 max-w-2xl">
            {loading ? (
                <RatingCardSkeletonList count={3} />
            ) : ratings.length > 0 ? (
                <>
                    <h2 className="text-xl font-bold flex px-5">Avaliações</h2>
                    <div
                        className={`
                            flex flex-col
                            w-full  divide-bunker-800 divide-y
                        `}
                    >
                        {ratings.map((rating) => (
                            <RatingCard key={rating.id} review={rating} />
                        ))}
                    </div>

                    {total > 5 && ratings.length < total && (
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
                </>
            ) : (
                <div className="text-xl font-bold  px-5 mt-10 text-center w-full">
                    <h2 className="">Nenhuma avaliação ainda</h2>
                </div>
            )}
        </div>
    );
}
