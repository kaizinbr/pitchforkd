"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Avatar as Ava2 } from "@mantine/core";

export default function Avatar({
    uid,
    src,
    size,
    onUpload,
    className,
}: {
    uid: string | null;
    src: string | null;
    size: number;
    onUpload: (src: string) => void;
    className?: string;
}) {
    const supabase = createClient();
    const [avatarSrc, setAvatarSrc] = useState<string | null>(src);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                if (path.startsWith("https")) {
                    setAvatarSrc(path);
                    return;
                }

                const { data, error } = await supabase.storage
                    .from("avatars")
                    .download(path);

                if (error) {
                    throw error;
                }

                const src = URL.createObjectURL(data);
                setAvatarSrc(src);
            } catch (error) {
                console.log("Error downloading image: ", error);
            }
        }

        if (src) downloadImage(src);
    }, [src, supabase]);

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
        event
    ) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${uid}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(filePath);
        } catch (error) {
            alert("Error uploading avatar!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex relative flex-col justify-center items-center h-48 w-48 rounded-full">
            {avatarSrc ? (
                <picture
                    className={`
                        flex flex-row justify-center items-center
                        bg-neutral-800 rounded-full overflow-hidden
                        size-44
                        ${className}
                        
                    `}
                >
                    <Image
                        width={size}
                        height={size}
                        src={avatarSrc}
                        alt="Avatar"
                        className={`
                                object-cover object-center
                                min-w-full
                                avatar image
                            `}
                        style={{ height: size, width: size }}
                    />
                </picture>
            ) : (
                <Ava2
                    size={size}
                    radius="xl"
                    src={avatarSrc}
                    className={`
                            !rounded-full !size-44
                            
                        ${className}
                        `}
                    alt="Avatar"
                    style={{ height: size, width: size }}
                />
            )}
            <div style={{ width: size }} className="absolute w-full">
                <label
                    className={`
                            size-44 cursor-pointer flex rounded-full justify-center items-center
                            ${className}
                        `}
                    htmlFor="single"
                >
                    {uploading ? (
                        <div
                            className={`
                            size-44 flex rounded-full justify-center items-center bg-black/40
                            ${className}
                        `}
                        >
                            Uploading ...
                        </div>
                    ) : (
                        ""
                    )}
                </label>
                <input
                    style={{
                        visibility: "hidden",
                        position: "absolute",
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    );
}
