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

    const { data: user, error: sessionsError } = await supabase.auth.getUser()

    let isUser = false

    if (data.length === 0) {
        return <div>User not found</div>;
    }

    if (user && user.user) {
        isUser = user.user.id === data[0].id;
    }


    // console.log(data)

    return (
        <div className="flex flex-col gap-4 items-center relative">
            {data.length > 0 ? (
                <>
                    <Profile user={data[0]} isUser={isUser} />
                    <UserRatings user={data[0]} />
                </>

            ) : (
                <div>User not found</div>
            )}
        </div>
    );
}
