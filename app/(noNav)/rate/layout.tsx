import "@/app/globals.css";
import Navigator, { DesktopNavigator } from "@/components/Navigator";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Pitchforkd - Avalie álbuns de música",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
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
        <div className="flex-1 w-full flex flex-col items-center mb-20 min-h-screen">
            <div className="flex flex-col w-full">{children}</div>
        </div>
    );
}
