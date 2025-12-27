import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import Avatar from "@/components/ui/Avatar";
import { useRef } from "react";
import type { PutBlobResult } from "@vercel/blob";

import { upload } from '@vercel/blob/client';
// import ProfileImageEditor from "./crop";

import React, { useState } from "react";
import ImageCropper from "./crop";

export default function EditPfp({
    avatar_url,
    setAvatarUrl,
}: {
    avatar_url: string;
    setAvatarUrl: any;
}) {
    const [opened, { open, close }] = useDisclosure(false);

    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const inputFileRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        {
            event.preventDefault();

            if (!inputFileRef.current?.files) {
                throw new Error("No file selected");
            }

            const file = inputFileRef.current.files[0];

            const response = await fetch(
                `/api/avatar/upload?filename=${file.name}`,
                {
                    method: "PUT",
                    body: file,
                }
            );

            const newBlob = (await response.json()) as PutBlobResult;

                    console.log("newBlob", newBlob);
            setBlob(newBlob);
            setAvatarUrl(newBlob.url);
        }
    };

    const handleSave = (croppedImage: string | null) => {
        if (croppedImage) {
            // Aqui você pode implementar a lógica para salvar a imagem cortada
            console.log("Imagem cortada salva:", croppedImage);
        }
    };

    return (
        <>
            <form
            
            >
                <input
                    name="file"
                    ref={inputFileRef}
                    type="file"
                    id="file"
                    accept="image/jpeg, image/png, image/webp"
                    required
                    className="hidden"
                    onChange={handleImageUpload}
                />
                <label htmlFor="file" className="cursor-pointer">
                    <Avatar src={avatar_url} size={192} />
                </label>
            </form>

            <div
                className={`
                    flex flex-col justify-start
                    w-full
                `}
            >
                <div
                    className={`
                        bgPfp flex flex-col justify-end items-start relative
                        h-56 w-full
                    `}
                >
                    <div
                        className={`
                            flex flex-row justify-start items-center
                            gap-3 pt-8 px-4 w-full h-56
                            bg-gradient-to- from-transparent to-black/45 from-40% 
                            z-30
                        `}
                    >
                        <button
                            type="button"
                            className="cursor-pointer"
                            onClick={open}
                        >
                            <Avatar src={avatar_url} size={192} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
