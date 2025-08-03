"use client";
import { useState, useEffect } from "react";
import { Avatar as UserAvatar } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { extractColors } from "extract-colors";
import ColorThief from "colorthief";
import axios from "axios";

export default function Avatar({
    src,
    size,
    className,
    setColors,
    isIcon,
}: {
    src: string | null;
    size: number;
    className?: string;
    setColors?: (colors: string[]) => void;
    isIcon?: boolean;
}) {
    const supabase = createClient();
    const [avatarSrc, setAvatarSrc] = useState<string | null>(src);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                if (path.startsWith("https")) {
                    setAvatarSrc(path);
                    if (!isIcon) {
                        try {
                            const img = new Image();
                            img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

                            img.onload = () => {
                                try {
                                    const colorThief = new ColorThief();
                                    // Agora pode usar o elemento img carregado
                                    const dominantColor =
                                        colorThief.getColor(img);
                                    const palette = colorThief.getPalette(
                                        img,
                                        3
                                    ); // 3 cores

                                    console.log(
                                        "Dominant Color:",
                                        dominantColor
                                    );
                                    console.log("Palette:", palette);
                                    const colors = [
                                        `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
                                        `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`,
                                        `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`,
                                    ];
                                    if (setColors) setColors(colors);
                                } catch (error) {
                                    console.error(
                                        "Erro ao extrair cores:",
                                        error
                                    );
                                }
                            };

                            img.onerror = () => {
                                console.error("Erro ao carregar a imagem");
                            };

                            // Definir a URL da imagem por último
                            img.src = path;
                        } catch (error) {
                            console.error("Error extracting colors:", error);
                        }
                    }
                    return;
                }

                if (path.startsWith("data:image")) {
                    setAvatarSrc(path);
                    if (!isIcon) {
                        try {
                            const img = new Image();
                            img.src = path;
                            img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

                            img.onload = () => {
                                try {
                                    const colorThief = new ColorThief();
                                    const dominantColor =
                                        colorThief.getColor(img);
                                    const palette = colorThief.getPalette(
                                        img,
                                        3
                                    ); // 3 cores

                                    console.log(
                                        "Dominant Color:",
                                        dominantColor
                                    );
                                    console.log("Palette:", palette);
                                    const colors = [
                                        `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
                                        `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`,
                                        `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`,
                                    ];
                                    if (setColors) setColors(colors);
                                } catch (error) {
                                    console.error(
                                        "Erro ao extrair cores:",
                                        error
                                    );
                                }
                            };

                            img.onerror = () => {
                                console.error("Erro ao carregar a imagem");
                            };
                            img.src = path;
                        } catch (error) {
                            console.error("Error extracting colors:", error);
                        }
                    }
                    return;
                }

                const { data } = supabase.storage
                    .from("avatars")
                    .getPublicUrl(path);

                setAvatarSrc(data.publicUrl);
                // console.log(data.publicUrl);
                if (!isIcon) {
                    try {
                        const img = new Image();
                        img.src = data.publicUrl;
                        img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

                        img.onload = () => {
                            try {
                                const colorThief = new ColorThief();
                                const dominantColor = colorThief.getColor(img);
                                const palette = colorThief.getPalette(img, 3); // 3 cores

                                console.log("Dominant Color:", dominantColor);
                                console.log("Palette:", palette);
                                const colors = [
                                    `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
                                    `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`,
                                    `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`,
                                ];
                                if (setColors) setColors(colors);
                            } catch (error) {
                                console.error("Erro ao extrair cores:", error);
                            }
                        };

                        img.onerror = () => {
                            console.error("Erro ao carregar a imagem");
                        };
                            img.src = data.publicUrl;
                    } catch (error) {
                        console.error("Error extracting colors:", error);
                    }
                }

                // console.log("Downloaded image:", data);
            } catch (error) {
                console.log("Error downloading image: ", error);
            }
        }

        if (src) downloadImage(src);
    }, [src, supabase]);

    return (
        <UserAvatar
            src={avatarSrc}
            alt="Avatar"
            className={`
                ${className}
                size-6 !rounded-(--icon) text-woodsmoke-700
            `}
            size={size}
        />
    );
}
