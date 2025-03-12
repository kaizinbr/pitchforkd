import * as React from "react";
import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import Image from "next/image";
import { AlignJustify, X } from "lucide-react";
import { ReorderIcon } from "./Icon";

interface Artist {
    id: string;
    src: string;
    name: string;
}
export const Item = ({
    artist,
    setData,
    data,
    type,
    index
}: {
    artist: Artist;
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
        <Reorder.Item value={artist} id={artist.id} style={{ boxShadow, y }}>
            <div className="flex flex-row items-center justify-between p-2 pr-4 cursor-grab rounded-lg w-full bg-bunker-700 transition-all duration-300">
                <div className="flex flex-row  items-center">
                    <Image
                        className={`
                                size-10 rounded-full
                            `}
                        src={artist.src}
                        alt={artist.name}
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col items-start justify-center pr-4">
                        <p className="ml-3 text-left line-clamp-1 break-all">
                            {artist.name}
                        </p>
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
                                        (a: any) => a.id !== artist.id
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
