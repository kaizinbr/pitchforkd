import SetProfileForm from "@/components/firstLogin/SetProfileForm";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
    title: "Primeiro acesso | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};


export default async function SetProfile() {
    const supabase = createClient();

    const {
        data: { user },
    } = await (await supabase).auth.getUser();

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col w-full h-full m-auto justify-center items-center px-8 max-w-md gap-2">
                <SetProfileForm user={user} />
            </div>
        </div>
    );
}