import SearchLayout from "@/components/Search/search";
import Link from "next/link";
import Image from "next/image";
import { darkenColor } from "@/components/album/gen-gradient";

export const metadata = {
    title: "Explorar | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        tab?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const tab = searchParams?.tab || "albums";

    return (
        <div className="flex-1 w-full flex flex-col gap-8 items-center mx-auto max-w-2xl py-5 md:mt-16">
            <SearchLayout query={query} tab={tab} />
            <div className="w-full max-w-2xl grid grid-cols-2 gap-4 p-4 mt-16 md:mt-52">
                <Link
                    href={`/#`}
                    className={`
                        hover:underline
                        col-span-1 text-center
                        p-4 py-6 rounded-lg
                        transition-colors duration-300
                        flex flex-col gap-2 items-center
                        relative overflow-hidden
                    `}
                >
                    <div
                        className={`
                                        absolute size-full -z-50 from-40 
                                        top-0
                                        transition-all duration-200 ease-in-out overflow-hidden
                                        bg-blend-screen
                                    `}
                        style={{
                            backgroundImage: `linear-gradient(to bottom, ${darkenColor("rgb(149, 108, 60)", 0.2)}, transparent)`,
                            filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                        }}
                    >
                        <div className="absolute inset-0 max-w-sm m-auto flex items-center justify-center blur-3xl">
                            <div
                                style={{ backgroundColor: "rgb(149, 108, 60)" }}
                                className={`absolute rounded-full size-80 -top-1/3 -left-1/4 blur-3xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: "rgb(149, 120, 94)" }}
                                className={`absolute rounded-full -right-1/4 -top-1/3 w-80 h-100 blur-3xl`}
                            ></div>
                            <div
                                style={{
                                    backgroundColor: "rgb(220, 228, 250)",
                                }}
                                className={`absolute rounded-full left-1/3 top-8 w-24 h-80 rotate-45 blur-3xl`}
                            ></div>
                        </div>
                    </div>
                    <span className="font-bold text-xl">
                        Lançamentos
                    </span>
                    <Image
                        src="https://i.scdn.co/image/ab67616d00001e025e60af877ad9cf1adb6aa757"
                        alt="Lançamentos recentes"
                        width={128}
                        height={128}
                        className="rounded-lg shadow-lg"
                    />
                </Link>
                <Link
                    href={`/#`}
                    className={`
                        hover:underline
                        col-span-1 text-center
                        p-4 py-6 rounded-lg
                        transition-colors duration-300
                        flex flex-col gap-2 items-center
                        relative overflow-hidden
                    `}
                >
                    <div
                        className={`
                                        absolute size-full -z-50 from-40 
                                        top-0
                                        transition-all duration-200 ease-in-out overflow-hidden
                                        bg-blend-screen
                                    `}
                        style={{
                            backgroundImage: `linear-gradient(to bottom, ${darkenColor("rgb(97, 0, 0)", 0.2)}, transparent)`,
                            filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                        }}
                    >
                        <div className="absolute inset-0 max-w-sm m-auto flex items-center justify-center blur-3xl">
                            <div
                                style={{ backgroundColor: "rgb(215, 23, 19)" }}
                                className={`absolute rounded-full size-80 -top-1/3 -left-1/4 blur-3xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: "rgb(164, 128, 94)" }}
                                className={`absolute rounded-full -right-1/4 -top-1/3 w-80 h-100 blur-3xl`}
                            ></div>
                            <div
                                style={{
                                    backgroundColor: "rgb(249, 216, 156)",
                                }}
                                className={`absolute rounded-full left-1/3 top-8 w-24 h-80 rotate-45 blur-3xl`}
                            ></div>
                        </div>
                    </div>
                    <span className="font-bold text-xl">
                        Especiais
                    </span>
                    <Image
                        src="https://i.scdn.co/image/ab67616d00001e0213aa6dc3af9f2b0da6621f88"
                        alt="Lançamentos recentes"
                        width={128}
                        height={128}
                        className="rounded-lg shadow-lg"
                    />
                </Link>
                <Link
                    href={`/#`}
                    className={`
                        hover:underline
                        col-span-1 text-center
                        p-4 py-6 rounded-lg
                        transition-colors duration-300
                        flex flex-col gap-2 items-center
                        relative overflow-hidden
                    `}
                >
                    <div
                        className={`
                                        absolute size-full -z-50 from-40 
                                        top-0
                                        transition-all duration-200 ease-in-out overflow-hidden
                                        bg-blend-screen
                                    `}
                        style={{
                            backgroundImage: `linear-gradient(to bottom, ${darkenColor("rgb(0, 71, 124)", 0.2)}, transparent)`,
                            filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                        }}
                    >
                        <div className="absolute inset-0 max-w-sm m-auto flex items-center justify-center blur-3xl">
                            <div
                                style={{ backgroundColor: "rgb(4, 155, 212)" }}
                                className={`absolute rounded-full size-80 -top-1/3 -left-1/4 blur-3xl`}
                            ></div>
                            <div
                                style={{ backgroundColor: "rgb(94, 100, 148)" }}
                                className={`absolute rounded-full -right-1/4 -top-1/3 w-80 h-100 blur-3xl`}
                            ></div>
                            <div
                                style={{
                                    backgroundColor: "rgb(104, 183, 215)",
                                }}
                                className={`absolute rounded-full left-1/3 top-8 w-24 h-80 rotate-45 blur-3xl`}
                            ></div>
                        </div>
                    </div>
                    <span className="font-bold text-xl">
                        Os mais mais
                    </span>
                    <Image
                        src="https://i.scdn.co/image/ab67616d0000b273253a9c74941281b0407ce940"
                        alt="Lançamentos recentes"
                        width={128}
                        height={128}
                        className="rounded-lg shadow-lg"
                    />
                </Link>
            </div>
        </div>
    );
}
