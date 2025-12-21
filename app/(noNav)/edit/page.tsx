import Edit from "@/components/user/edit/edit-page";
import AccountForm from "./account-form";
import { createClient } from "@/utils/supabase/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Editar perfil | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};


export default async function Page() {
    const supabase = await createClient();
    const { data: user, error: sessionsError } = await supabase.auth.getUser()

    const session = await auth();

    if (!session?.user) {
        console.error("User is not authenticated");
        return <div>User is not authenticated</div>;
    }

    const profile = await prisma.profile.findFirst({
        where: { id: session.user.id },
    });

    if (!profile) {
        console.error("Error fetching user");
        return <div>Error fetching user</div>;
    }

    return (
        <div className="flex flex-col gap-4 items-center relative w-full pb-8">
            {profile ? (
                // <AccountForm profile={profile} />
                <Edit profile={profile} />
            ) : (
                <div>User not found</div>
            )}

        </div>
    )
}