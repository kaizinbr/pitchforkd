import AlbumPage from "@/components/album/AlbumPage";
import AlbumMain from "@/components/album/album-main";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
    title: "Álbum | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

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

    // console.log(data);

    return (
        <div className="flex flex-col gap-4 items-center relative">
            <AlbumMain album_id={id} />
        </div>
    );
}
