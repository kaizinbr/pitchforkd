import ReviewCard from "./review-card";

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
    reviews,
}: {
    reviews: Review[] | null;
}) {
    console.log(reviews);
    return (
        <div className="flex flex-col gap-6 items-center w-full">
            {reviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
}
