import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import Avatar from "@/components/ui/Avatar";
// import ProfileImageEditor from "./crop";

import React, { useState } from "react";
import ImageCropper from "./crop";

export default function EditPfp({ avatar_url, setAvatarUrl }: { avatar_url: string; setAvatarUrl: any }) {
    const [opened, { open, close }] = useDisclosure(false);

    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                console.log("reader.result:", reader.result);
            };
            reader.readAsDataURL(file);
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
            <Modal
                opened={opened}
                onClose={close}
                title="Selecione uma imagem de perfil"
                fullScreen
                radius={0}
                transitionProps={{ transition: "fade", duration: 200 }}
                classNames={{
                    inner: "!z-[999]",
                    content: "!bg-shark-900",
                    header: "!bg-shark-900",
                }}
            >
                <ImageCropper close={close} avatar_url={avatar_url} setAvatarUrl={setAvatarUrl} />
            </Modal>

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
