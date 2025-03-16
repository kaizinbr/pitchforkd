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
            <div className="w-full relative mb-3 z-10">
                <Avatar
                    size={32}
                    src={review.profiles.avatar_url}
                    className={"size-8 absolute top-[16px] z-20 mx-auto"}
                    isIcon
                />
                <Image
                    src={album.images[0]?.url}
                    alt={album.name}
                    width={160}
                    height={160}
                    className="rounded-lg max-w-full w-40 shadow-xl relative z-0 mx-auto"
                />
            </div>
            <p className="text-xl !font-bold mb-3 z-10">
                {formatRate(review.total)}
            </p>
            <p className=" text-xs text-center mb-4 max-w-full line-clamp-2 z-10">
                {review.profiles.name || review.profiles.username} avaliou{" "}
                <span className="!font-bold">{album.name}</span>
            </p>
            <Comment review={review} loading={false} likes={0} />

            <p className="text-[10px] text-bunker-300 text-center mt-3 z-10">
                Veja mais em pitchforkd.me
            </p>
        </>
    );
}
