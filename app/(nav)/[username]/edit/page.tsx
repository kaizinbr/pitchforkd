import AccountForm from "./account-form";
import { createClient } from "@/utils/supabase/server";


export default async function Page({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;

    const lowerCaseUsername = username.toLowerCase();


    const supabase = await createClient();
    const { data: user, error: sessionsError } = await supabase.auth.getUser()



    if (!user.user) {
        console.error("User is not authenticated");
        return <div>User is not authenticated</div>;
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.user.id);

    if (error) {
        console.error("Error fetching user", error);
        return <div>Error fetching user</div>;
    }

    return (
        <div className="flex flex-col gap-4 items-center relative">
            {data.length > 0 ? (
                <AccountForm profile={data[0]} />
            ) : (
                <div>User not found</div>
            )}

        </div>
    )
}