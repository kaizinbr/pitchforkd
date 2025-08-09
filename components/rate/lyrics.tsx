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
}: {
    track_id: string;
    album_img: string;
}) {
    const [lyrics, setLyrics] = useState<LyricsLine[]>([]);
    const [error, setError] = useState<string>("");

    const [color1, setColor1] = useState<string>("#4a6d73");
    const [color2, setColor2] = useState<string>("#b78972");
    const [color3, setColor3] = useState<string>("#691209");
    const [textColor, setTextColor] = useState<string>("#ffffff");

    useEffect(() => {
        const fetchData = async () => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    // Agora pode usar o elemento img carregado
                    const dominantColor = colorThief.getColor(img);
                    const palette = colorThief.getPalette(img); // 3 cores
                    const mostSaturatedColor = getMostSaturatedColor(palette);

                    console.log("Dominant Color:", dominantColor);
                    console.log("Palette:", palette);
                    console.log("Most Saturated Color:", mostSaturatedColor);

                    setColor1(mostSaturatedColor ?? "#4a6d73");
                    setColor2(
                        `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
                    );
                    setColor3(
                        `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`
                    );

                    const textColor = getTextColor(color1);
                    console.log("Text Color:", textColor);
                    setTextColor(textColor);
                } catch (error) {
                    console.error("Erro ao extrair cores:", error);
                }
            };

            img.onerror = () => {
                console.error("Erro ao carregar a imagem");
            };
            img.src = album_img;
        };

        fetchData();
    }, [album_img]);

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
        <div
            className={
                `
                w-full max-w-2xl px-5 pb-8 bg-bunker-800 p-4 gap-4 rounded-xl
                max-h-[400px] overflow-y-auto
                scrollbar-hide touch-pan-y
            `
            }
            style={{
                backgroundColor: color1,
                color: textColor,
            }}
        >
            <h3 className="text-sm font-semibold text-white/70 mb-4">Letras</h3>
            {error && <p className="">{error}</p>}
            {lyrics && (
                <div className="whitespace-pre-wrap break-words font-bold flex flex-col gap-3">
                    {lyrics.map((line, index) => (
                        <p key={index}>{line.words}</p>
                    ))}
                </div>
            )}
        </div>
    );
}
