import ReviewCard from "./review-card";
import RatingCard from "../user/RatingCard";

import { Review } from "@/lib/utils/types";

export default function DisplayReviews({
    ratings,
}: {
    ratings: Review[] | null;
}) {
    // console.log(ratings);
    return (
        <div className="flex flex-col w-full">
            <h2 className="text-xl font-bold flex px-5">Reviews</h2>
            <div
                className={`
                    flex flex-col
                    w-full divide-y divide-neutral-800
                `}
            >
                {ratings?.map((rating) => (
                    <RatingCard key={rating.id} review={rating} />
                ))}
            </div>
        </div>
    );
}
