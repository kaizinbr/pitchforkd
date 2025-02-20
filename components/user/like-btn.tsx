import { createClient } from "@/utils/supabase/client";
import Icon from "../ui/Icon";

export default function LikeBtn({
    liked,
    setLiked,
    rating_id,
    owner_id,
    type,
    size,
    className,
}: {
    liked: boolean;
    setLiked: React.Dispatch<React.SetStateAction<boolean>>;
    rating_id: string;
    owner_id: string;
    type?: string;
    size?: string;
    className?: string;
}) {
    async function handleLike({ rating_id, owner_id }: { rating_id: string; owner_id: string }) {
        const supabase = createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            console.error("User not logged in");
            return;
        }

        const { data, error } = await supabase
            .from("likes")
            .select("*")
            .eq("user_id", user.id)
            .eq("rating_id", rating_id);

        if (error) {
            console.error(error);
            return;
        }

        if (data.length) {
            await supabase
                .from("likes")
                .delete()
                .eq("user_id", user.id)
                .eq("rating_id", rating_id);

            await supabase
                .from("notifications")
                .delete()
                .eq("user_id", owner_id)
                .eq("sender_id", user.id)
                .eq("rating_id", rating_id);
            

            setLiked(false);
        } else {
            await supabase.from("likes").insert([
                {
                    user_id: user.id,
                    user_profile: user.id,
                    rating_id: rating_id,
                },
            ]);

            await supabase.from("notifications").insert([
                {
                    user_id: owner_id,
                    sender_id: user.id,
                    rating_id: rating_id,
                },
            ]);

            setLiked(true);
        }
    }

    return (
        <button
            onClick={() => handleLike({rating_id, owner_id})}
            className={`
                flex items-center justify-center z-50 cursor-pointer
                transition-all duration-200 ease-in-out 
                ${size === "sm" ? "h-6 w-6" : "size-6"}
                ${className}
            `}
        >
            <Icon type="heart" className={`
                    transition-all duration-200 ease-in-out 
                    ${liked ? "text-red-500" : "text-gray-500"}
                `} />
        </button>
    );
}
