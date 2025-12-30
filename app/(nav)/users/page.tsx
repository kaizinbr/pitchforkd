import { createClient } from "@/utils/supabase/server";
import DisplayReviews from "@/components/display-reviews/main";
import ImageCarousel from "@/components/carousel/carousel";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import UserList from "@/components/user/User-List";

export default async function Home() {
    const users = await prisma.profile.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        
                <div className="flex-1 flex flex-col gap-6 pt-8 md:pt-20 h-lvh justify-center items-center w-full">
                    {users && (
                        <UserList users={users} />
                    ) }
                </div>
    );
}
