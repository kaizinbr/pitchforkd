import Avatar from "@/components/ui/Avatar";
import Image from "next/image";
import formatRate from "@/lib/utils/formatRate";
import { Album, Review } from "@/lib/utils/types";
import Comment from "@/components/rate/share/comment";

export default function Card({
    currentColor,
    album,
    review,
}: {
    currentColor: string;
    album: Album;
    review: Review;
}) {
    // console.log(review)
    return (
        <>
            {/* <div
                className={`
                        absolute h-8/10 w-full z-0 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${currentColor}, black)`,
                }}
            ></div> */}
            <div className="w-full relative mb-3 z-10">
                <Avatar
                    size={28}
                    src={review.profiles.avatar_url}
                    className={"size-8 absolute top-[14px] z-20 mx-auto"}
                    isIcon
                />
                <Image
                    src={album.images[0]?.url}
                    alt={album.name}
                    width={152}
                    height={152}
                    className="rounded-lg max-w-full w-38 shadow-xl relative mx-auto z-10"
                />
                            <div className="absolute w-full  -z-10  top-[28px]">
                                <div className="size-38 blur-[100px] mx-auto max-w-full"
                                style={{
                                backgroundColor: currentColor,
                                                        }}></div>
                            </div>
            </div>
            <p className="text-xl !font-extrabold mb-3 z-10">
                {formatRate(review.total)}
            </p>
            <p className=" text-[10px] text-center mb-1 max-w-full line-clamp-2 z-10">
                {review.profiles.name || review.profiles.username} avaliou{" "}
                <span className="!font-bold">{album.name}</span>
            </p>
            <p className=" text-[10px] text-center mb-4 max-w-full line-clamp-2 z-10 text-bunker-300">
                De <span className="!font-bold">{album.artists[0].name}</span>
            </p>

            <p className="text-[8px] text-bunker-300 text-center z-10 font-light">
                Veja mais em pitchforkd.me
            </p>
        </>
    );
}
