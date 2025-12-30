"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import axios from "axios";
import { toPng, getFontEmbedCSS, toJpeg } from "html-to-image";
import html2canvas from 'html2canvas';
import { AlbumRate, Review } from "@/lib/utils/types";
import Card from "./card";
import CopyText from "./copy-text";

export default function ShareRate({ id, rate }: { id?: string; rate: Review }) {
    const [album, setAlbum] = useState<any>();
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [currentColor, setCurrentColor] = useState<string>("#4a6d73");
    const [colors, setColors] = useState<{ hex: string; rgb: string }[]>([]);
    
    const [color1, setColor1] = useState<string>("#4a6d73");
    const [color2, setColor2] = useState<string>("#4a6d73");
    const [color3, setColor3] = useState<string>("#4a6d73");
    useEffect(() => {
        if (colors.length > 0) {
            setColor1(colors[0].rgb);
            setColor2(colors[1].rgb);
            setColor3(colors[2].rgb);
        }
    }, [colors]);

    const [cardStyle, setCardStyle] = useState<
        "dynamic" | "linear" | "spotlight"
    >("dynamic");

    const ref = useRef<HTMLDivElement>(null);

    const handleCapture = async () => {
      if (ref.current) {
        const canvas = await html2canvas(ref.current, { allowTaint: true, useCORS: true });
        // You can now use the 'canvas' object, for example, to download it as an image:
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'captured_image.png';
        link.click();
      }
    };

    const onButtonClick = useCallback(async () => {
        if (ref.current === null) {
            console.error("Ref is null");
            return;
        }
        await document.fonts.ready;

        const fontEmbedCSS = await getFontEmbedCSS(ref.current);

        toPng(ref.current, {
            canvasWidth: 1080,
            canvasHeight: 1920,
            cacheBust: true,
            pixelRatio: 2,
            quality: 1,
            fontEmbedCSS,
            // useCORS: true,
        })
            .then((dataUrl) => {
                const link = document.createElement("a");
                const date = new Date().toISOString().replace(/[:.]/g, "-");
                link.download = `rating-${rate.shorten}-${date}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `/api/spot/album/${rate.albumId}`
            );
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
                            `/api/spot/album/${id}/tracks?offset=${i * 50}`
                        );
                        tracks2 = [...tracks2, ...response.data.items];
                        console.log("Offset:", i * 50);
                    }
                }
                console.log("Tracks:", tracks2);
                setTracks(tracks2);
            }

            setLoading(false);
            const colorThief = new ColorThief();
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = response.data.images[0].url;

            img.onload = () => {
                const colors = colorThief.getPalette(img, 10);
                const colorsWithRGB = colors.map((color) => {
                    return {
                        hex: `#${color
                            .map((c) => c.toString(16).padStart(2, "0"))
                            .join("")}`,
                        rgb: `rgb(${color.join(",")})`,
                    };
                });
                setColors(colorsWithRGB);

                console.log("Colors:", colorsWithRGB);
                console.log("Color :", colors);
            };
            img.onerror = (error) => {
                console.error("Error loading image:", error);
            };

            img.src = response.data.images[0]?.url;
        };

        fetchData();
    }, [id]);

    return (
        <>
            {album && (
                <>
                    <div
                        className={`
                            rounded-xl overflow-hidden
                            aspect-[9/16] w-8/12 mx-auto
                            max-w-[285px]
                        `}
                    >
                        <div
                            className={`
                            transition-all duration-500 text-white
                            bg-black
                            shadow-lg aspect-[9/16] w-full
                            relative overflow-hidden
                            flex flex-col items-center justify-center px-8
                        `}
                            ref={ref}
                        >
                            <Card
                                currentColor={currentColor}
                                color1={color1}
                                color2={color2}
                                color3={color3}
                                album={album}
                                review={rate}
                                cardStyle={cardStyle}
                            />
                        </div>
                    </div>
                    <button
                        className={`
                            py-2 cursor-pointer
                            flex justify-center items-center
                            bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600 
                            text-white !font-semibold rounded-xl
                            max-w-[285px] mx-auto w-full
                            transition-all duration-300
                        `}
                        onClick={async () => {
                            await onButtonClick();
                        }}
                    >
                        Baixar
                    </button>
                    <div className="w-full max-w-2xl px-5">
                        <div className="p-4 w-full bg-shark-800 rounded-xl">
                            <h2 className="text-center text font-semibold mb-2">
                                Configurações
                            </h2>

                            <div className="mb-4">
                                <p className="text-center text-sm mb-3">
                                    Estilo do card
                                </p>
                                <div className="flex flex-row gap-2 w-full justify-center flex-wrap">
                                    <button
                                        className={`
                                            px-3 py-1.5 rounded-full text-xs font-medium
                                            transition-all duration-200 cursor-not-allowed

                                            ${cardStyle === "dynamic"
                                                ? "bg-main-500 text-white"
                                                : "bg-shark-700 text-shark-300 hover:bg-shark-600"
                                             }
                                        `}
                                        onClick={() => setCardStyle("dynamic")}
                                        // disabled
                                    >
                                        Dinâmico
                                    </button>
                                    <button
                                        className={`
                                            px-3 py-1.5 rounded-full text-xs font-medium
                                            transition-all duration-200 cursor-pointer
                                            ${
                                                cardStyle === "linear"
                                                    ? "bg-main-500 text-white"
                                                    : "bg-shark-700 text-shark-300 hover:bg-shark-600"
                                            }
                                        `}
                                        onClick={() => setCardStyle("linear")}
                                    >
                                        Linear
                                    </button>
                                    <button
                                        className={`
                                            px-3 py-1.5 rounded-full text-xs font-medium
                                            transition-all duration-200 cursor-pointer
                                            ${
                                                cardStyle === "spotlight"
                                                    ? "bg-main-500 text-white"
                                                    : "bg-shark-700 text-shark-300 hover:bg-shark-600"
                                            }
                                        `}
                                        onClick={() =>
                                            setCardStyle("spotlight")
                                        }
                                    >
                                        Holofote
                                    </button>
                                </div>
                            </div>

                            {cardStyle === "dynamic" ? (
                                <>
                                <div className="flex flex-col items-center bg-shark-700 rounded-md p-2 mb-2">
                                    <p className="text-center text-sm mb-3">
                                        Cor de fundo 1
                                    </p>
                                    <div className="flex flex-row flex-wrap gap-2 w-full max-w-2xl justify-center">
                                        {colors.length > 0 &&
                                            colors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={`
                                                        size-8 rounded-xl
                                                        bg-[${color.rgb}] cursor-pointer
                                                    `}
                                                    style={{
                                                        backgroundColor:
                                                            color.rgb,
                                                    }}
                                                    onClick={() =>
                                                        setColor1(
                                                            color.rgb
                                                        )
                                                    }
                                                ></button>
                                            ))}
                                        <button className="size-8 rounded-xl bg-white cursor-pointer" onClick={() => setColor1("#ffffff")}></button>
                                        <button className="size-8 rounded-xl bg-black cursor-pointer" onClick={() => setColor1("#000000")}></button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center bg-shark-700 rounded-md p-2 mb-2">
                                    <p className="text-center text-sm mb-3">
                                        Cor de fundo 2
                                    </p>
                                    <div className="flex flex-row flex-wrap gap-2 w-full max-w-2xl justify-center">
                                        {colors.length > 0 &&
                                            colors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={`
                                                        size-8 rounded-xl
                                                        bg-[${color.rgb}] cursor-pointer
                                                    `}
                                                    style={{
                                                        backgroundColor:
                                                            color.rgb,
                                                    }}
                                                    onClick={() =>
                                                        setColor2(
                                                            color.rgb
                                                        )
                                                    }
                                                ></button>
                                            ))}
                                        <button className="size-8 rounded-xl bg-white cursor-pointer" onClick={() => setColor2("#ffffff")}></button>
                                        <button className="size-8 rounded-xl bg-black cursor-pointer" onClick={() => setColor2("#000000")}></button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center bg-shark-700 rounded-md p-2 mb-2">
                                    <p className="text-center text-sm mb-3">
                                        Cor de fundo 3
                                    </p>
                                    <div className="flex flex-row flex-wrap gap-2 w-full max-w-2xl justify-center">
                                        {colors.length > 0 &&
                                            colors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={`
                                                        size-8 rounded-xl
                                                        bg-[${color.rgb}] cursor-pointer
                                                    `}
                                                    style={{
                                                        backgroundColor:
                                                            color.rgb,
                                                    }}
                                                    onClick={() =>
                                                        setColor3(
                                                            color.rgb
                                                        )
                                                    }
                                                ></button>
                                            ))}
                                        <button className="size-8 rounded-xl bg-white cursor-pointer" onClick={() => setColor3("#ffffff")}></button>
                                        <button className="size-8 rounded-xl bg-black cursor-pointer" onClick={() => setColor3("#000000")}></button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center bg-shark-700 rounded-md p-2">
                                    <p className="text-center text-sm mb-3">
                                        Cor de fundo 4
                                    </p>
                                    <div className="flex flex-row flex-wrap gap-2 w-full max-w-2xl justify-center">
                                        {colors.length > 0 &&
                                            colors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={`
                                                        size-8 rounded-xl
                                                        bg-[${color.rgb}] cursor-pointer
                                                    `}
                                                    style={{
                                                        backgroundColor:
                                                            color.rgb,
                                                    }}
                                                    onClick={() =>
                                                        setCurrentColor(
                                                            color.rgb
                                                        )
                                                    }
                                                ></button>
                                            ))}
                                        <button className="size-8 rounded-xl bg-white cursor-pointer" onClick={() => setCurrentColor("#ffffff")}></button>
                                        <button className="size-8 rounded-xl bg-black cursor-pointer" onClick={() => setCurrentColor("#000000")}></button>
                                    </div>
                                </div>
                                
                                </>
                            ) : (
                                <>
                                    <p className="text-center text-sm mb-3">
                                        Selecione a cor do fundo
                                    </p>
                                    <div className="flex flex-row flex-wrap gap-2 w-full max-w-2xl justify-center">
                                        {colors.length > 0 &&
                                            colors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={`
                                            size-8 rounded-xl
                                            bg-[${color.rgb}] cursor-pointer
                                        `}
                                                    style={{
                                                        backgroundColor:
                                                            color.rgb,
                                                    }}
                                                    onClick={() =>
                                                        setCurrentColor(
                                                            color.rgb
                                                        )
                                                    }
                                                ></button>
                                            ))}
                                        <button className="size-8 rounded-xl bg-white cursor-pointer" onClick={() => setCurrentColor("#ffffff")}></button>
                                        <button className="size-8 rounded-xl bg-black cursor-pointer" onClick={() => setCurrentColor("#000000")}></button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <CopyText rate={rate} album={album} />
                </>
            )}
        </>
    );
}
