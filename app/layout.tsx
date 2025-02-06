import { Geist } from "next/font/google";
import "@/app/globals.css";
import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';
import localFont from "next/font/local";
import {
    ColorSchemeScript,
    MantineProvider,
    mantineHtmlProps,
} from "@mantine/core";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "txt 4th gen leaders",
    description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

// Font files can be colocated inside of `app`
const myFont = localFont({
    src: "../public/fonts/font-1.ttf",
    display: "swap",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-br"
            className={myFont.className}
            // suppressHydrationWarning
            {...mantineHtmlProps}
        >
            <head>
                <ColorSchemeScript />
            </head>
            <body className="bg-neutral-900 text-neutral-100">
                <MantineProvider>
                    <main className="min-h-screen flex flex-col items-center">
                        <div className="flex flex-col w-full">
                            {children}
                        </div>
                    </main>
                </MantineProvider>
            </body>
        </html>
    );
}
