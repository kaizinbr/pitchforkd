import { createClient } from "@/utils/supabase/server";
import DisplayRate from "@/components/rate/display/display-rate-page";

export default async function Page({
    params,
}: {
    params: Promise<{ username: string, id: string }>;
}) {
    const username = (await params).username;
    const id = (await params).id;
    // console.log(username, id);

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("lowercased_username", username.toLowerCase());

    if (error) {
        console.error("Error fetching user", error);
        return <div>Error fetching user</div>;
    }

    const { data: albumData, error: albumError } = await supabase
        .from("ratings")
        .select(
            `*,
            profiles(
                *
            )`
        )
        .eq("album_id", id)
        .eq("user_id", data[0].id);

    if (albumError) {
        console.error("Error fetching album", albumError);
        return <div>Error fetching album</div>;
    }

    // console.log(data, albumData);

    return (
        <div className="flex flex-col gap-4 items-center relative">
            <DisplayRate id={id} user={data[0]} rate={albumData[0]} />
        </div>
    );
}
