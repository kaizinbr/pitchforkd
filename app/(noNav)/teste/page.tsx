import TestEdit from "@/components/user/edit/test";

import { createClient } from "@/utils/supabase/server";

export const metadata = {
    title: "Editar perfil | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};


export default async function Page() {
    const supabase = await createClient();
    const { data: user, error: sessionsError } = await supabase.auth.getUser()



    if (!user.user) {
        console.error("User is not authenticated");
        return <div>User is not authenticated</div>;
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.user.id);

    if (error) {
        console.error("Error fetching user", error);
        return <div>Error fetching user</div>;
    }

    return (
        <div className="flex flex-col gap-4 items-center relative w-full pb-8">
            {data.length > 0 ? (
                // <AccountForm profile={data[0]} />
                <TestEdit profile={data[0]} />
            ) : (
                <div>User not found</div>
            )}

        </div>
    )
}