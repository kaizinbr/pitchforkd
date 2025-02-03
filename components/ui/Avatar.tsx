"use client";
import { useState, useEffect } from "react";
import { Avatar as UserAvatar } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { extractColors } from "extract-colors";

export default function Avatar({
    src,
    size,
    className,
    setCurrentColor,
}: {
    src: string | null;
    size: number;
    className?: string;
    setCurrentColor?: (color: string) => void;
}) {
    const supabase = createClient();
    const [avatarSrc, setAvatarSrc] = useState<string | null>(src);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data } = supabase.storage
                    .from("avatars")
                    .getPublicUrl(path);

                setAvatarSrc(data.publicUrl);
                extractColors(data.publicUrl)
                    .then((colors) => {
                        if (setCurrentColor) {
                            const maxIntensityColor = colors.reduce(
                                (prev, current) => {
                                    const prevIntensity = prev.intensity;
                                    const currentIntensity = current.intensity;
                                    return currentIntensity > prevIntensity
                                        ? current
                                        : prev;
                                }
                            );
                            setCurrentColor(maxIntensityColor.hex);
                            console.log("Color:", maxIntensityColor.hex);
                        }
                    })
                    .catch(console.error);
                console.log("Downloaded image:", data);
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
                size-6 rounded-full text-woodsmoke-700
            `}
            size={size}
        />
    );
}
