import { createClient } from "@/utils/supabase/server";
import DisplayRate from "@/components/rate/display/display-rate-page";
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
        .eq("shorten", shorten);

    if (error) {
        console.error("Error fetching user", error);
    }

    return {
        title:
            data && data.length > 0
                ? `Avaliação de ${data[0].profiles.name || data[0].profiles.username} | Pitchforkd`
                : "Avaliação | Pitchforkd",
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
        .eq("shorten", shorten);

    if (albumError) {
        console.error("Error fetching album", albumError);
        return <div>Error fetching album</div>;
    }

    // console.log(data, albumData);

    return (
        <div className="flex flex-col gap-4 items-center relative">
            <DisplayRate rate={data[0]} />
        </div>
    );
}
