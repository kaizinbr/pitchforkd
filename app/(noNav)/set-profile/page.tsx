import SetProfileForm from "@/components/firstLogin/SetProfileForm";
import { createClient } from "@/utils/supabase/server";


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