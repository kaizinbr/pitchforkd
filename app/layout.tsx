import { Work_Sans } from "next/font/google";
import "@/app/globals.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
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
// const myFont = localFont({
//     src: "../public/fonts/font-1.ttf",
//     display: "swap",
// });

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-br"
            className={graphik.className}
            {...mantineHtmlProps}
        >
            <head>
                <ColorSchemeScript />
            </head>
            <body className={ graphik.className + ` !bg-bunker-950 !text-neutral-100 fontGraphik`}>
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
