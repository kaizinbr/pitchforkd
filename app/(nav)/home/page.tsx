import { createClient } from "@/utils/supabase/server";
import DisplayReviews from "@/components/display-reviews/main";
import ImageCarousel from "@/components/carousel/carousel";
import Link from "next/link";

export default async function Home() {
    const supabase = createClient();

    const { data, error } = await (
        await supabase
    )
        .from("ratings")
        .select(
            `*,
            profiles(
                *
            )`
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .range(0, 29);

    if (error) {
        console.error("Error fetching reviews", error);
        return <div>Error fetching reviews</div>;
    }

    const { data: dataLength, error: errorLength } = await (await supabase)
        .from("ratings")
        .select(
            `*,
            profiles(
                *
            )`
        )
        .eq("is_published", true);

    if (error) {
        console.error("Error fetching reviews", error);
        return <div>Error fetching reviews</div>;
    }

    return (
        <>
            <main className="flex-1 flex flex-col gap-6 pt-8 md:pt-20 h-lvh justify-center items-center w-full">
                <Link
                    href={`https://pitchforkd.me/`}
                    className="font-bold mb-4 pl-5 text-xl md:hidden w-full text-start"
                >
                    Pitchforkd
                </Link>
                <ImageCarousel />
                {data && dataLength ? (
                    <DisplayReviews
                        ratings={data}
                        ratingsLength={dataLength.length}
                    />
                ) : (
                    <div>Não há reviews</div>
                )}
            </main>
        </>
    );
}
