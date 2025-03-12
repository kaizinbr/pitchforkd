import * as React from "react";
import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import Image from "next/image";
import { AlignJustify, X } from "lucide-react";
import { ReorderIcon } from "./Icon";

interface Album {
    id: string;
    src: string;
    title: string;
    type?: string;
    artist: string;
}
export const Item = ({
    Album,
    setData,
    data,
    type,
    index
}: {
    Album: Album;
    setData?: any;
    data?: any;
    type?: string;
    index: number;
}) => {
    const controls = useDragControls();
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    // console.log(index, Album)

    return (
        <Reorder.Item value={Album} id={Album.id} style={{ boxShadow, y }}>
            <div className="flex flex-row items-center justify-between p-2 pr-4 cursor-grab rounded-lg w-full bg-bunker-700 transition-all duration-300">
                <div className="flex flex-row  items-center">
                    <Image
                        className={`
                                w-10 h-10 rounded-md
                            `}
                        src={Album.src}
                        alt={Album.title}
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col items-start justify-center pr-4">
                        <p className="ml-3 text-left line-clamp-1 break-all">
                            {Album.title}
                        </p>
                        {Album.artist && (
                            <p className="ml-3 text-left text-xs text-neutral-300 line-clamp-1 break-all">
                                {Album.artist}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    <AlignJustify
                        className="ml-auto"
                        size={24}
                        color="#ffffff"
                    />
                    <X
                        className="ml-4 cursor-pointer"
                        size={24}
                        color="#ffffff"
                        onClick={() => {
                            if (setData) {
                                setData((prevdata: any) =>
                                    prevdata.filter(
                                        (a: any) => a.id !== Album.id
                                    )
                                );
                            }
                        }}
                    />
                </div>
            </div>
        </Reorder.Item>
    );
};
