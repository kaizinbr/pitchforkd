import { Work_Sans, Lora, Open_Sans } from "next/font/google";
import "@/app/globals.css";
import "@/app/embla.css";


// ✅ Import all global styles separately
import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';

import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';


import localFont from "next/font/local";
import { Notifications } from "@mantine/notifications";

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

const lora = Lora({
    display: "swap",
    subsets: ["latin"],
});

const openSans = Open_Sans({
    display: "swap",
    subsets: ["latin"],
});

const graphik = localFont({
    src: [
        {
            path: "../public/fonts/font/Graphik-Thin.woff2",
            weight: "100",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-ThinItalic.woff2",
            weight: "100",
            style: "italic",
        },
        {
            path: "../public/fonts/font/Graphik-Extralight.woff2",
            weight: "200",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-ExtralightItalic.woff2",
            weight: "200",
            style: "italic",
        },
        {
            path: "../public/fonts/font/Graphik-Light.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-LightItalic.woff2",
            weight: "300",
            style: "italic",
        },
        {
            path: "../public/fonts/font/Graphik-Regular.woff2",
            weight: "normal",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-RegularItalic.woff2",
            weight: "normal",
            style: "italic",
        },
        {
            path: "../public/fonts/font/Graphik-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-MediumItalic.woff2",
            weight: "500",
            style: "italic",
        },
        {
            path: "../public/fonts/font/Graphik-Semibold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-SemiboldItalic.woff2",
            weight: "600",
            style: "italic",
        },
        {
            path: "../public/fonts/font/Graphik-Bold.woff2",
            weight: "bold",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-BoldItalic.woff2",
            weight: "bold",
            style: "italic",
        },
        {
            path: "../public/fonts/font/Graphik-Black.woff2",
            weight: "900",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-BlackItalic.woff2",
            weight: "900",
            style: "italic",
        },
        {
            path: "../public/fonts/font/Graphik-Super.woff2",
            weight: "900",
            style: "normal",
        },
        {
            path: "../public/fonts/font/Graphik-SuperItalic.woff2",
            weight: "900",
            style: "italic",
        },
    ],
});

const walsheim = localFont({
    src: [
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Ultra-Light.woff2",
            weight: "100",
            style: "normal",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Ultra-Light-Oblique.woff2",
            weight: "100",
            style: "italic",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Thin.woff2",
            weight: "200",
            style: "normal",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Thin-Oblique.woff2",
            weight: "200",
            style: "italic",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Light.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Light-Oblique.woff2",
            weight: "300",
            style: "italic",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Regular-Oblique.woff2",
            weight: "400",
            style: "italic",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Medium-Oblique.woff2",
            weight: "500",
            style: "italic",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Bold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Bold-Oblique.woff2",
            weight: "700",
            style: "italic",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Black.woff2",
            weight: "800",
            style: "normal",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Black-Oblique.woff2",
            weight: "800",
            style: "italic",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Ultra-Bold.woff2",
            weight: "900",
            style: "normal",
        },
        {
            path: "../public/fonts/walsheim/GT-Walsheim-LC-Ultra-Bold-Oblique.woff2",
            weight: "900",
            style: "italic",
        },
    ],
});

const walfork = localFont({
    src: [
        {
            path: "../public/fonts/p/Walfork-Demi.woff", //public\fonts\p\Walfork-Demi.woff
            weight: "bold",
            style: "normal",
        },
        {
            path: "../public/fonts/p/Walfork-DemiOblique.woff",
            weight: "bold",
            style: "italic",
        },
        {
            path: "../public/fonts/p/Walfork-Regular.woff",
            weight: "200",
            style: "normal",
        },
        {
            path: "../public/fonts/p/Walfork-RegularOblique.woff",
            weight: "200",
            style: "italic",
        },
    ],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br" className={walsheim.className} {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body
                className={
                    walsheim.className + ` !bg-shark-950 !text-neutral-100 `
                }
            >
                <MantineProvider defaultColorScheme="dark">
                    <Notifications
                        classNames={{
                            root: "!z-[1000]",
                        }}
                    />
                    <main className="min-h-screen flex flex-col items-center">
                        <div className="flex flex-col items-center w-full">
                            {children}
                        </div>
                        <Footer />
                    </main>
                </MantineProvider>
                <script src="https://accounts.google.com/gsi/client" async></script>
            </body>
        </html>
    );
}
