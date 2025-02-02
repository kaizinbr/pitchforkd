import Profile from "@/components/user/Profile";
import UserRatings from "@/components/user/UserRatings";
import { createClient } from "@/utils/supabase/server";

export default async function Page({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;

    const lowerCaseUsername = username.toLowerCase();

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("lowercased_username", lowerCaseUsername);

    if (error) {
        console.error("Error fetching user", error);
        return <div>Error fetching user</div>;
    }

    // console.log(data)

    return (
        <div>
            {data.length > 0 ? (
                <div>
                    <Profile user={data[0]} />
                    <UserRatings user={data[0]} />
                </div>

            ) : (
                <div>User not found</div>
            )}
        </div>
    );
}
