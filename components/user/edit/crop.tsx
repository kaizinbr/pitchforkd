import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/utils/cropImage"; // Função para processar a imagem
import { Area } from "react-easy-crop/types";
import { createClient } from "@/utils/supabase/client";

import Avatar from "@/components/user/edit/avatar";

export default function ImageCropper({
    avatar_url,
    setAvatarUrl,
    close
}: {
    avatar_url: string;
    setAvatarUrl: any;
    close: any;
}) {
    const supabase = createClient();

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const onCropComplete = useCallback(
        async (croppedArea: Area, croppedAreaPixels: Area) => {
            if (imageSrc) {
                const croppedImage = await getCroppedImg(
                    imageSrc,
                    croppedAreaPixels
                );
                setCroppedImage(croppedImage);
                // console.log("Cropped image:", croppedImage);
            }
        },
        [imageSrc]
    );

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const dataURLtoBlob = (dataURL: any) => {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    };

    const handleSave = async () => {
        if (croppedImage) {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                // setUploading(true);
                if (!user) {
                    console.error("User not logged in");
                    return;
                }

                const file = dataURLtoBlob(croppedImage);
                const filePath = `${user.id}-${Math.random()}.webp`;

                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, file, {
                        contentType: file.type,
                    });

                const { data: publicUrl } = await supabase.storage
                    .from("avatars")
                    .getPublicUrl(filePath);

                setAvatarUrl(publicUrl.publicUrl);

                if (uploadError) {
                    console.log("Error uploading avatar:", uploadError);
                    throw uploadError;
                }
                setImageSrc(null);
            } catch (error) {
                console.error("Error uploading avatar:", error);
                alert("Error uploading avatar!");
            } finally {
                close();
                // setUploading(false);
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
            <Avatar
                uid="aaaaaaa"
                url={avatar_url}
                size={192}
                onUpload={handleImageUpload}
            />
            {imageSrc && (
                <div>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                    <div
                        className={`
                            z-[9999]
                            fixed right-1/2 transform translate-x-1/2
                            max-w-2xl mx-auto bottom-16
                            flex flex-row gap-4
                        `}
                    >
                        <button
                            onClick={() => setImageSrc(null)}
                            className={`
                                py-2 px-6
                                flex justify-center items-center
                                text-white text-sm !font-semibold rounded-xl
                                cursor-pointer
                                transition-all duration-300
                                bg-gray-500 hover:bg-gray-600 
                            `}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className={`
                            py-2 px-6
                            flex justify-center items-center
                            text-white text-sm !font-semibold rounded-xl
                            cursor-pointer
                            transition-all duration-300
                              bg-green-pastel hover:bg-main-600 
                        `}
                        >
                            Salvar
                        </button>
                    </div>
                    {/* {croppedImage && (
                        <img
                            src={croppedImage}
                            alt="Cropped"
                            style={{ width: "100px", height: "100px" }}
                        />
                    )} */}
                </div>
            )}
        </div>
    );
}
