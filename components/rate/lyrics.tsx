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
    album_img,
    backgroundColor,
    textColor
}: {
    track_id: string;
    album_img: string;
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
        <div className="relative w-full max-w-2xl">
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
                    backgroundColor: backgroundColor,
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

            {/* gradiente superior */}
            <div
                className="pointer-events-none absolute top-0 left-0 w-full h-14 z-20 rounded-t-xl"
                style={{
                    background: `linear-gradient(${backgroundColor} 20%, transparent 100%)`,
                }}
            />

            {/* gradiente inferior */}
            <div
                className="pointer-events-none absolute bottom-0 left-0 w-full h-14 z-20 rounded-b-xl"
                style={{
                    background: `linear-gradient(transparent, ${backgroundColor} 80%)`,
                }}
            />
        </div>
    );
}
