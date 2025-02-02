import { createClient } from "@/utils/supabase/server";


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
        .select("*")
        .eq("album_id", id)

    if (albumError) {
        console.error("Error fetching album", albumError);
        return <div>Error fetching album</div>;
    }

    console.log(data, albumData);

    return (
        <div>
            Review de {username} para {id}
        </div>
    );
}
