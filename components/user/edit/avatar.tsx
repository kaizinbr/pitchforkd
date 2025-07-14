"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Avatar as Ava2 } from "@mantine/core";
import { Pen } from "lucide-react";

export default function Avatar({
    uid,
    url,
    size,
    onUpload,
    username,
}: {
    uid: string | null;
    url: string | null;
    size: number;
    onUpload: any;
    username?: string | null;
}) {
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {

                // console.log(path)

                if (path.startsWith("https")) {
                    setAvatarUrl(path);
                    return;
                }

                if (path.startsWith("data:image")) {
                    setAvatarUrl(path);
                    return;
                }

                const { data, error } = await supabase.storage
                    .from("avatars")
                    .download(path);
                if (error) {
                    throw error;
                }

                const url = URL.createObjectURL(data);
                setAvatarUrl(url);
            } catch (error) {
                console.log("Error downloading image: ", error);
            }
        }

        if (url) downloadImage(url);
    }, [url, supabase]);



    return (
        <div className="flex relative flex-col justify-center items-center h-48 w-48 !rounded-(--icon) ">
            {avatarUrl ? (
                <picture
                    className={`
                        flex flex-row justify-center items-center
                        bg-bunker-800 !rounded-(--icon) overflow-hidden
                        w-48 h-48
                        
                    `}
                >
                    <Image
                        width={size}
                        height={size}
                        src={avatarUrl}
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
                    src={avatarUrl}
                    className="!rounded-(--icon)"
                    alt="Avatar"
                    style={{ height: size, width: size }}
                />
            )}
            <div style={{ width: size }} className="absolute w-full h-full">
                <label
                    className="w-48 h-48 cursor-pointer flex !rounded-(--icon) justify-center items-center"
                    htmlFor="single"
                >
                    {uploading ? (
                        <div className="h-48 w-48 flex !rounded-(--icon) justify-center items-center bg-black/40">
                            Uploading ...
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="button primary block bg-orange-safety p-3 !rounded-(--icon) absolute right-2 bottom-2 z-10">
                        <Pen size={14} className="" />
                    </div>
                </label>
                <input
                    style={{
                        visibility: "hidden",
                        position: "absolute",
                    }}
                    className="w-0 invisible absolute"
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={onUpload}
                    disabled={uploading}
                />
            </div>
        </div>
    );
}
