import Avatar from "@/components/ui/Avatar";
import Image from "next/image";
import { forwardRef } from "react";




const Card = forwardRef<HTMLDivElement, { currentColor: string; album: any; rate: any }>(
    ({ currentColor, album, rate }, ref) => {
    return (
        <div
            className={` 
                transition-all duration-500 text-white
                aspect-[9/16] w-8/12 my-16 rounded-xl 
                shadow-lg
                relative overflow-hidden
                flex flex-col items-center justify-center px-8
            `}
        >
            <div
                className={`
                        absolute h-full w-full -z-10 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${currentColor}, black)`,
                }}
            ></div>
            <div className="w-full relative mb-4">
                <Avatar
                    size={40}
                    src={rate.profiles.avatar_url}
                    className={"size-10 absolute top-5 z-20 mx-auto"}
                    isIcon
                />
                <Image
                    src={album.images[0]?.url}
                    alt={album.name}
                    width={256}
                    height={256}
                    className="rounded-lg w-full shadow-lg relative z-0"
                />
            </div>
            <p className="text-xl font-bold mb-4">
                {rate.total.toFixed(1)}/100
            </p>
            <p className="font-semibold text-sm text-center line-clamp-2">
                {rate.profiles.name} avaliou{" "}
                <span className="font-bold">{album.name}</span>
            </p>

            <p className="text-xs text-neutral-300 text-center mt-4">
                Veja mais em letterfy.kaizin.com.br
            </p>
        </div>
    );
})

export default forwardRef(Card);