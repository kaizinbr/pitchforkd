import Avatar from "@/components/ui/Avatar";
import Image from "next/image";
import formatRate from "@/lib/utils/formatRate";
import { Album, Review } from "@/lib/utils/types";

export default function Card({
    currentColor,
    album,
    rate,
}: {
    currentColor: string;
    album: Album;
    rate: Review;
}) {
    return (
        <>
            <div
                className={`
                        absolute h-8/10 w-full z-0 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${currentColor}, black)`,
                }}
            ></div>
            <div className="w-full relative mb-4 z-10">
                <Avatar
                    size={36}
                    src={rate.profiles.avatar_url}
                    className={"size-9 absolute top-[18px] z-20 mx-auto"}
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
            <p className="text-xl !font-bold mb-4 z-10">
                {formatRate(rate.total)}
            </p>
            <p className=" text-xs text-center max-w-full line-clamp-2 z-10">
                {rate.profiles.name || rate.profiles.username} avaliou{" "}
                <span className="!font-bold">{album.name}</span>
            </p>

            <p className="text-[10px] text-bunker-300 text-center mt-4 z-10">
                Veja mais em pitchforkd.me
            </p>
        </>
    );
}
