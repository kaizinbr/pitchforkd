import { createClient } from "@/utils/supabase/server";
import DisplayReviews from "@/components/display-reviews/main";

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
        .order("created_at", { ascending: false });

    return (
        <>
            <main className="flex-1 flex flex-col gap-6 pt-16 h-lvh justify-center items-center w-full">
                    <h1 className="text-xl font-semibold text-center">
                        Comece a avaliar seus álbuns favoritos!
                    </h1>
                    <DisplayReviews ratings={data} />
            </main>
        </>
    );
}
