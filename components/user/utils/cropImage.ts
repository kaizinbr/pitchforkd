import getCroppedImg, { Area } from "react-easy-crop";

const cropImage = async (imageSrc: string, croppedAreaPixels: Area): Promise<string> => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            const base64Image = canvas.toDataURL("image/jpeg");
            resolve(base64Image);
        };

        image.onerror = (error) => {
            reject(error);
        };
    });
};

export default cropImage;