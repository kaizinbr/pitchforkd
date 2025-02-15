import { createClient } from "@/utils/supabase/server";
import ShareRate from "@/components/rate/share/share-rate";

export default async function Page({
    params,
}: {
    params: Promise<{ shorten: string }>;
}) {
    const shorten = (await params).shorten;
    // console.log(shorten);

    const supabase = await createClient();

    const { data, error: albumError } = await supabase
        .from("ratings")
        .select(
            `*,
            profiles(
                *
            )`
        )
        .eq("shorten", shorten);

    if (albumError) {
        console.error("Error fetching album", albumError);
        return <div>Error fetching album</div>;
    }

    // console.log(data, albumData);

    return (
        <div className="flex flex-col gap-4 items-center relative">
            <ShareRate rate={data[0]} />
        </div>
    );
}
