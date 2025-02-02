import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import "@/app/globals.css";
import Navigator from "@/components/Navigator";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "txt 4th gen leaders",
    description: "The fastest way to build apps with Next.js and Supabase",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="flex-1 w-full flex flex-col items-center">
            <Navigator user={user} />
            <div className="flex flex-col p-5 w-full">{children}</div>
        </div>
    );
}
