import { useEffect, useState } from "react";
import ColorThief from "colorthief";
import {
    darkenColor,
    getTextColor,
    getMostSaturatedColor,
} from "@/components/album/gen-gradient";

type LyricsLine = {
    startTimeMs: string;
    words: string;
    syllables: any[]; // Use a more specific type if you know the structure of syllables
    endTimeMs: string;
};

export default function CurrentLyrics({
    track_id,
    darkVibrant,
    vibrant,
    lightMuted,
    backgroundColor,
    textColor,
}: {
    track_id: string;
    darkVibrant: string;
    vibrant: string;
    lightMuted: string;
    backgroundColor: string;
    textColor: string;
}) {
    const [lyrics, setLyrics] = useState<LyricsLine[]>([]);
    const [error, setError] = useState<string>("");

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const img = new Image();
    //         img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

    //         img.onload = () => {
    //             try {
    //                 const colorThief = new ColorThief();
    //                 // Agora pode usar o elemento img carregado
    //                 const dominantColor = colorThief.getColor(img);
    //                 const palette = colorThief.getPalette(img); // 3 cores
    //                 const mostSaturatedColor = getMostSaturatedColor(palette);

    //                 console.log("Dominant Color:", dominantColor);
    //                 console.log("Palette:", palette);
    //                 console.log("Most Saturated Color:", mostSaturatedColor);

    //                 setColor1(mostSaturatedColor ?? "#4a6d73");
    //                 setColor2(
    //                     `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
    //                 );
    //                 setColor3(
    //                     `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`
    //                 );

    //                 const textColor = getTextColor(color1);
    //                 console.log("Text Color:", textColor);
    //                 setTextColor(textColor);
    //             } catch (error) {
    //                 console.error("Erro ao extrair cores:", error);
    //             }
    //         };

    //         img.onerror = () => {
    //             console.error("Erro ao carregar a imagem");
    //         };
    //         img.src = album_img;
    //     };

    //     fetchData();
    // }, [album_img]);

    useEffect(() => {
        const fetchLyrics = async () => {
            const response = await fetch(`/api/lyrics/${track_id}`);
            const data = await response.json();
            // console.log(response);
            if (data.error) {
                if (response.status === 404) {
                    console.error("Faixa não encontrada");
                    setError(
                        "Parece que não encontramos a letra dessa música..."
                    );
                    setLyrics([]);
                }
                return;
            } else {
                setLyrics(data.lines);
                setError("");
            }
        };

        fetchLyrics();
    }, [track_id]);

    return (
        <div className="w-full flex px-4">
            <div className="relative w-full mx-auto max-w-2xl">
                <h3 className="text-sm font-semibold text-white/70 top-3 left-5 z-30 absolute">
                    Letras
                </h3>
                <div
                    className={`
                        relative z-10
                        p-5 gap-4 rounded-xl
                        max-h-[400px] h-[400px] overflow-y-auto no-scrollbar touch-pan-y
                    `}
                    style={{
                        // backgroundColor: backgroundColor,
                        color: textColor,
                    }}
                >
                    {error && (
                        <div className="h-full flex items-center">
                            <p>{error}</p>
                        </div>
                    )}
                    {lyrics.length > 0 && (
                        <div className="whitespace-pre-wrap break-words font-medium text-lg flex flex-col gap-5 pt-8 pb-16">
                            {lyrics.map((line, index) => (
                                <p key={index}>{line.words}</p>
                            ))}
                            <h3 className="text-sm font-normal text-white/70 mb-4">
                                Letras obtidas através do Spotify/Musixmatch
                            </h3>
                        </div>
                    )}
                </div>

                <div
                    className={`
                    absolute size-full -z-50 from-40 
                    top-0
                    transition-all duration-200 ease-in-out 
                    overflow-hidden rounded-xl
                    bg-blend-screen
                `}
                    style={{
                        backgroundImage: `linear-gradient(to bottom, ${darkenColor(darkVibrant, 0.8)}, ${vibrant})`,
                        filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                    }}
                >
                    <div className="absolute inset-0 max-w-sm m-auto flex items-center justify-center blur-3xl">
                        <div
                            style={{ backgroundColor: vibrant }}
                            className={`absolute rounded-full size-80 -top-1/3 -left-1/4 blur-3xl`}
                        ></div>
                        <div
                            style={{ backgroundColor: lightMuted }}
                            className={`absolute rounded-full -right-1/4 -top-1/3 w-80 h-100 blur-3xl`}
                        ></div>
                        <div
                            style={{ backgroundColor: darkVibrant }}
                            className={`absolute rounded-full left-1/3 top-8 w-24 h-80 rotate-45 blur-3xl`}
                        ></div>
                    </div>
                </div>

                {/* gradiente superior */}
                {/* <div
                    className="pointer-events-none absolute top-0 left-0 w-full h-14 z-20 rounded-t-xl"
                    style={{
                        background: `linear-gradient(${darkVibrant} 20%, transparent 100%)`,
                    }}
                /> */}
                {/* gradiente inferior */}
                {/* <div
                    className="pointer-events-none absolute bottom-0 left-0 w-full h-14 z-20 rounded-b-xl"
                    style={{
                        background: `linear-gradient(transparent, ${backgroundColor} 80%)`,
                    }}
                /> */}
            </div>
        </div>
    );
}
