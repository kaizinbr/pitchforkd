import SetProfileForm from "@/components/firstLogin/SetProfileForm";
import { createClient } from "@/utils/supabase/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Primeiro acesso | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};


export default async function SetProfile() {
    const session = await auth();
    if (!session) {
        throw new Error("Usuário não autenticado");
    }

    const profile = await prisma.profile.findFirst({
            where: { id: session?.user!.id },
        });
    console.log("Profile na página de primeiro acesso:", profile);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col w-full h-full m-auto justify-center items-center px-8 max-w-md gap-2">
                <SetProfileForm profile={profile} />
            </div>
        </div>
    );
}