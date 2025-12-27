import "@/app/globals.css";
import Navigator, { DesktopNavigator } from "@/components/Navigator";
import { cookies } from "next/headers";
import { redirect, RedirectType } from 'next/navigation'

//migrando para neondb
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

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
    const session = await auth();
    const cookieStore = await cookies();

    const isnewuser = cookieStore.get("new")?.value === "true" || false;
    console.log("Is new user:", isnewuser);
    if (isnewuser) {
        redirect('/new-user', RedirectType.replace);
    }

    let profile = null;

    if (!session?.user) {
        console.log("Não tá logado!");
    } else {
        profile = await prisma.profile.findUnique({
            where: { id: session.user.id },
        });
    }

    return (
        <div className="flex-1 w-full flex flex-col items-center mb-20 min-h-screen">
            <Navigator profile={profile} />
            <DesktopNavigator profile={profile} />
            <div className="flex flex-col w-full">{children}</div>
        </div>
    );
}
