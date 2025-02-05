import ReviewCard from "./review-card";
import RatingCard from "../user/RatingCard";

interface Reviews {
    id: number;
    album_id: string;
    user_id: string;
    review: string;
    ratings: number;
    created_at: string;
    total: number;
    profile: string;
}

interface Review {
    id: string;
    created_at: string;
    user_id: string;
    album_id: string;
    review: string;
    ratings: [
        {
            id: string;
            value: number;
            favorite: boolean;
        },
    ];
    total: number;
    profiles: User;
}

interface User {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    site: string;
    bio: string;
    pronouns: string;
}

export default function DisplayReviews({
    ratings,
}: {
    ratings: Review[] | null;
}) {
    console.log(ratings);
    return (
        <div className="flex flex-col w-full p-5 gap-4">
            <h2 className="text-xl font-bold">Reviews</h2>
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
