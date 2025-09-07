"use client";
import { useState, useEffect } from "react";
import { Avatar as UserAvatar } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";

import { Vibrant } from "node-vibrant/browser";

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
    // const { vibrant, muted, darkVibrant } = useColors(avatarSrc || undefined);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                if (path.startsWith("https")) {
                    setAvatarSrc(path);
                    if (!isIcon) {
                        try {
                            const img = new Image();
                            img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

                            img.onerror = () => {
                                console.error("Erro ao carregar a imagem");
                            };

                            // Definir a URL da imagem por último
                            img.src = path;

                            // console.log("Image loaded:", img);
                            // console.log("Image src:", img.src);

                            Vibrant.from(img.src)
                                .getPalette()
                                .then((palette) => {
                                    // console.log(palette);
                                    setColors &&
                                        setColors([
                                            palette.Vibrant?.hex ?? "#ffffff",
                                            palette.Muted?.hex ?? "#ffffff",
                                            palette.DarkVibrant?.hex ?? "#222",
                                        ]);
                                });
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

                            img.onerror = () => {
                                console.error("Erro ao carregar a imagem");
                            };
                            img.src = path;

                            // console.log("Image loaded:", img);
                            // console.log("Image src:", img.src);
                            Vibrant.from(img.src)
                                .getPalette()
                                .then((palette) => {
                                    // console.log(palette);
                                    setColors &&
                                        setColors([
                                            palette.Vibrant?.hex ?? "#ffffff",
                                            palette.Muted?.hex ?? "#ffffff",
                                            palette.DarkVibrant?.hex ?? "#222",
                                        ]);
                                });
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

                        img.onerror = () => {
                            console.error("Erro ao carregar a imagem");
                        };
                        img.src = data.publicUrl;

                        // console.log("Image loaded:", img);
                        // console.log("Image src:", img.src);

                        Vibrant.from(img.src)
                            .getPalette()
                            .then((palette) => {
                                // console.log(palette);
                                setColors &&
                                    setColors([
                                        palette.Vibrant?.hex ?? "#ffffff",
                                        palette.Muted?.hex ?? "#ffffff",
                                        palette.DarkVibrant?.hex ?? "#222",
                                    ]);
                            });
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
