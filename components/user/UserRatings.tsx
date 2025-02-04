"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import RatingCard from "./RatingCard";

export default function UserRatings({ user }: { user: any }) {
    const [ratings, setRatings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching ratings", error);
            }

            console.log(data);
            setRatings(data!);
            setLoading(false);
        }

        fetchRatings();
    }, []);

    return (
        <div className="w-full p-5 flex flex-col gap-4">
            {loading ? (
                <div>Loading...</div>
            ) : ratings.length > 0 ? (
                <>
                    <h2 className="text-xl font-bold">Reviews</h2>
                    <div
                        className={`
                            flex flex-col
                            w-full divide-y divide-neutral-800
                        `}
                    >
                        {ratings.map((rating) => (
                            <RatingCard key={rating.id} review={rating} />
                        ))}
                    </div>
                </>
            ) : (
                <div>No ratings</div>
            )}
        </div>
    );
}
