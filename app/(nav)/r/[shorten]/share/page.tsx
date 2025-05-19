import { createClient } from "@/utils/supabase/server";
import ShareRate from "@/components/rate/share/share-rate";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ shorten: string}>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const shorten = (await params).shorten;
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("ratings")
        .select(
            `*,
            profiles(
                *
            )`
        )
        .eq("is_published", true)
        .eq("shorten", shorten);

    if (error) {
        console.error("Error fetching user", error);
    }

    return {
        title:
            data && data.length > 0
                ? `Compartilhar avaliação de ${data[0].profiles.name || data[0].profiles.username} | Pitchforkd`
                : "Compartilhar avaliação | Pitchforkd",
    };
}

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
        .eq("is_published", true)
        .eq("shorten", shorten);

    if (albumError) {
        console.error("Error fetching album", albumError);
        return <div>Error fetching album</div>;
    }

    // console.log(data, albumData);

    return (
        <div className="flex flex-col gap-4 items-center relative pt-16 md:pt-24">
            <ShareRate rate={data[0]} />
        </div>
    );
}
