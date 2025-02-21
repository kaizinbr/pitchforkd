import { Work_Sans } from "next/font/google";
import "@/app/globals.css";
import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';
import localFont from "next/font/local";
import {
    ColorSchemeScript,
    MantineProvider,
    mantineHtmlProps,
} from "@mantine/core";
import Footer from "@/components/footer";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Pitchforkd - Avalie álbuns de música",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

const workSans = Work_Sans({
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
            {...mantineHtmlProps}
        >
            <head>
                <ColorSchemeScript  />
            </head>
            <body className={` !bg-bunker-950 !text-neutral-100`}>
                <MantineProvider defaultColorScheme="dark">
                    <main className="min-h-screen flex flex-col items-center">
                        <div className="flex flex-col items-center w-full">
                            {children}
                        </div>
                        <Footer />
                    </main>
                </MantineProvider>
            </body>
        </html>
    );
}
