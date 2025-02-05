import AlbumPage from "@/components/album/AlbumPage";
import AlbumMain from "@/components/album/album-main";
import { createClient } from "@/utils/supabase/server";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("ratings")
        .select(
            `*,
            profiles(
                *
            )`
        )
        .eq("album_id", id);

    if (error) {
        console.error("Error fetching album", error);
        return <div>Error fetching album</div>;
    }

    console.log(data);

    return (
        <>
            <AlbumMain album_id={id} />
        </>
    );
}
