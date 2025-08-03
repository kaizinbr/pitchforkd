"use client";

import { useState, useEffect } from "react";
import AlbumCover from "@/components/album/album-cover";
import axios from "axios";
import AlbumData from "./album-data";
import AlbumTracks from "./album-tracks";
import AlbumBtn from "./album-btn";
import ColorThief from "colorthief";
import { darkenColor } from "./gen-gradient";

export default function AlbumMain({ album_id }: { album_id: string | null }) {
    const [album, setAlbum] = useState<any>([]);
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [color1, setColor1] = useState<string>("#4a6d73");
    const [color2, setColor2] = useState<string>("#b78972");
    const [color3, setColor3] = useState<string>("#691209");

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/spot/album/${album_id}`);
            console.log(response.data);
            setAlbum(response.data);
            setTracks(response.data.tracks.items);

            if (response.data.total_tracks > 50) {
                console.log("Mais de 50 músicas");

                const offsetTimes = Math.ceil(response.data.total_tracks / 50);

                let tracks2: any[] = response.data.tracks.items;

                for (let i = 0; i < offsetTimes; i++) {
                    if (i === 0) {
                        null;
                    } else {
                        const response = await axios.get(
                            `/api/spot/album/${album_id}/tracks?offset=${i * 50}`
                        );
                        tracks2 = [...tracks2, ...response.data.items];
                        console.log("Offset:", i * 50);
                    }
                }
                console.log("Tracks:", tracks2);
                setTracks(tracks2);
            }

            const img = new Image();
            img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    // Agora pode usar o elemento img carregado
                    const dominantColor = colorThief.getColor(img);
                    const palette = colorThief.getPalette(img, 3); // 3 cores

                    console.log("Dominant Color:", dominantColor);
                    console.log("Palette:", palette);

                    setColor1(
                        `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
                    );
                    setColor2(
                        `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
                    );
                    setColor3(
                        `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`
                    );
                } catch (error) {
                    console.error("Erro ao extrair cores:", error);
                }
            };

            img.onerror = () => {
                console.error("Erro ao carregar a imagem");
            };

            // Definir a URL da imagem por último
            img.src = response.data.images[0]?.url;

            setLoading(false);

            // extractColors(response.data.images[0]?.url)
            //     .then((colors) => {
            //         setColorsArray(colors);

            //         updateColor(colors);
            //         const sortedColors = [...colors]
            //             .filter((c) => c.lightness <= 0.8)
            //             .sort((a, b) => b.intensity - a.intensity);

            //         // Função para calcular pontuação de uma cor
            //         const calculateColorScore = (color: any) => {
            //             let score = 0;

            //             // Peso para área (maior área = melhor)
            //             const areaWeight = 0.4;
            //             score += (color.area || 0) * areaWeight;

            //             // Peso para lightness ideal (entre 0.3 e 0.85)
            //             const lightnessWeight = 0.3;
            //             const idealLightness =
            //                 color.lightness >= 0.3 && color.lightness <= 0.85;
            //             if (idealLightness) {
            //                 // Bonus para lightness no range ideal
            //                 score += lightnessWeight * 100;
            //                 // Bonus extra para lightness próximo ao centro do range (0.575)
            //                 const centerDistance = Math.abs(
            //                     color.lightness - 0.575
            //                 );
            //                 score +=
            //                     (1 - centerDistance) * lightnessWeight * 50;
            //             } else {
            //                 // Penalidade para lightness fora do range
            //                 score -= lightnessWeight * 50;
            //             }

            //             // Peso para intensidade (maior intensidade = melhor)
            //             const intensityWeight = 0.3;
            //             score += (color.intensity || 0) * intensityWeight * 100;

            //             // Peso para saturação (cores mais saturadas = melhor)
            //             const saturationWeight = 0.1;
            //             score +=
            //                 (color.saturation || 0) * saturationWeight * 100;

            //             return score;
            //         };

            //         // Filtrar e ordenar cores por pontuação
            //         const scoredColors = colors
            //             .map((color) => ({
            //                 ...color,
            //                 score: calculateColorScore(color),
            //             }))
            //             .filter(
            //                 (color) =>
            //                     color.lightness >= 0.2 &&
            //                     color.lightness <= 0.9 &&
            //                     color.intensity > 0.1 // Filtrar cores muito fracas
            //             )
            //             .sort((a, b) => b.score - a.score); // Maior pontuação primeiro

            //         console.log("Scored Colors:", scoredColors);

            //         updateColor(scoredColors);

            //         const css = generatePleasantGradient(scoredColors);

            //         setColor1(css[0]);
            //         setColor2(css[1]);
            //         setColor3(css[2]);
            //     })
            //     .catch(console.error);
        };

        fetchData();
    }, [album_id]);

    return (
        <>
            <div
                className={`
                    absolute h-[30rem] w-full -z-50 from-40 
                    top-0
                    transition-all duration-200 ease-in-out overflow-hidden
                    bg-blend-screen
                `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${darkenColor(color1, 1.5)}, transparent)`,
                    filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center blur-3xl">
                    <div
                        style={{ backgroundColor: color1 }}
                        className={`absolute rounded-full bg-[${color1}] size-100 -top-1/3 -left-1/4 blur-3xl`}
                    ></div>
                    <div
                        style={{ backgroundColor: color3 }}
                        className={`absolute rounded-full -right-1/4 -top-1/3 w-80 h-100 blur-3xl`}
                    ></div>
                    <div
                        style={{ backgroundColor: color2 }}
                        className={`absolute rounded-full left-0 top-1/3 size-40 blur-3xl`}
                    ></div>
                </div>
            </div>
            <AlbumCover album={album} loading={loading} />
            <AlbumData album={album} tracks={tracks} loading={loading} />
            <AlbumBtn album={album} loading={loading} />
            {tracks.length > 0 ? (
                <AlbumTracks tracks={tracks} loading={loading} />
            ) : null}
        </>
    );
}
