import Favorites from "@/components/user/FavoritesHeader";
import UserHeader from "@/components/user/Profile";
import UserRatings from "@/components/user/UserRatings";
import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ username: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const username = (await params).username;
    const lowerCaseUsername = username.toLowerCase();
    // fetch data
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("lowercased_username", lowerCaseUsername);

    if (error) {
        console.error("Error fetching user", error);
    }

    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || [];

    return {
        title:
            data && data.length > 0
                ? data[0].username + " | Pitchforkd"
                : "Usuário não encontrado | Pitchforkd",
        // openGraph: {
        //     images: ["/some-specific-page-image.jpg", ...previousImages],
        // },
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;

    const lowerCaseUsername = username.toLowerCase();

    let reviewCount: Array<{ id: string }> = [];
    let isUser = false;

    const supabase = await createClient();

    const { data: user, error: sessionsError } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("lowercased_username", lowerCaseUsername);

    if (error) {
        console.error("Error fetching user", error);
        return;
    } else {
        if (data.length === 0) {
            return (
                <div className="h-full min-h-screen w-full flex">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-2xl">Usuário não encontrado</div>
                    </div>
                </div>
            );
        } else {
            const { data: reviewCount2, error: reviewError } = await supabase
                .from("ratings")
                .select("id")
                .eq("user_id", data[0].id);

            if (reviewError) {
                console.error("Error fetching reviews", reviewError);
            } else {
                reviewCount = reviewCount2;
            }
        }

        if (user && user.user) {
            isUser = user.user.id === data[0].id;
        }
    }

    // console.log(data)

    return (
        <div className="flex flex-col gap-4 items-center relative">
            {data.length > 0 && reviewCount ? (
                <>
                    <UserHeader
                        user={data[0]}
                        isUser={isUser}
                        reviewCount={reviewCount?.length}
                    />
                    <Favorites favorites={data[0].favorites} isUser={isUser} />
                    <UserRatings user={data[0]} />
                </>
            ) : (
                <div className="h-full w-full flex">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-2xl">Carregando...</div>
                    </div>
                </div>
            )}
        </div>
    );
}
