"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import RatingCard from "./RatingCard";

export default function UserRatings ({ user }: { user: any }) {
    const [ratings, setRatings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        async function fetchRatings() {
            const { data, error } = await supabase
                .from("ratings")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching ratings", error);
            }

            console.log(data)
            setRatings(data!);
            setLoading(false);
        }

        fetchRatings();
    }, []);

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : ratings.length > 0 ? (
                <div>
                    <h2>Ratings</h2>
                    <div>
                        {ratings.map((rating) => (
                            <RatingCard key={rating.id} rating={rating} username={user.username} />
                        ))}
                    </div>
                </div>
            ) : (
                <div>No ratings</div>
            )}
        </div>
    )
}