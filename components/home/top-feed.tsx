"use client";
import AlbunsCarousel from "@/components/carousel/carousel";
import { useState, useEffect } from "react";
import axios from "axios";
import { darkenColor, lightenColor } from "@/components/album/gen-gradient";

export default function TopFeed() {
    const [topColor, setTopColor] = useState<string>("");
    const [bannerContent, setBannerContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/spot/banner`);
                console.log("Banner API response:", response.data);

                setBannerContent(response.data);
                console.log("Banner content with colors:", response.data);
                setTopColor(response.data[0]?.darkVibrant || "#1B3955");
            } catch (error) {
                console.error("Erro ao buscar dados do banner:", error);

                // Fallback para dados estáticos se a API falhar
                const fallbackData = [
                    {
                        title: "Only cry in the rain",
                        artist: "CHUU",
                        src: "https://i.scdn.co/image/ab67616d0000b2733533ec688f7b48a135fd1e47",
                        from: "#1B3955",
                        to: "#A8B8C4",
                        text: "text-white",
                        album_id: "5BenIQ2E8TFdZoAtPjUP9a",
                    },
                ];
                setBannerContent(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {!loading && (
                <div
                    className={`
                    absolute h-100 w-full -z-50 from-40 
                    top-0
                    transition-all duration-300 ease-in-out overflow-hidden
                    bg-blend-screen
                `}
                    style={{
                        backgroundImage: `linear-gradient(to bottom, ${darkenColor(topColor, 0.6)}, transparent)`,
                        filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                    }}
                >
                    <div className="absolute inset-0 max-w-sm m-auto flex items-center justify-center blur-3xl md:hidden">
                        <div
                            style={{ backgroundColor: lightenColor(topColor, 1) }}
                            className={`absolute rounded-full h-80 w-98 -top-1/3 -left-1/2 blur-3xl transition-all duration-200`}
                        ></div>
                    </div>
                </div>
            )}
            <section className="w-full flex flex-col gap-6">
                <h1 className="font-bold text-2xl md:text-3xl pl-5 max-w-2xl w-full mx-auto">
                    Destaques Recentes
                </h1>
                {loading ? (
                    <div className="w-full max-w-250 mx-auto px-5">
                        <div className="animate-pulse">
                            <div className="bg-shark-800 rounded-3xl h-64 md:h-80"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <AlbunsCarousel
                            bannerContent={bannerContent}
                            setTopColor={setTopColor}
                        />
                    </>
                )}
            </section>
        </>
    );
}
