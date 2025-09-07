import ResultsPage from "@/components/Search/results";
import UserRatings from "@/components/user/UserRatings";
import { createClient } from "@/utils/supabase/server";

export default async function UserReviewsPage({
    params,
}: {
    params: Promise<{ query: string }>;
}) {
    const query = (await params).query;


    return (
        <div className="w-full">
            <ResultsPage query={query} type="albums" />
        </div>
    );
}