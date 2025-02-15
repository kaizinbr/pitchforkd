import Avatar from "@/components/ui/Avatar";
import Image from "next/image";

export default function Card ({ currentColor, album, rate }: { currentColor: string; album: any; rate: any }) {
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
            <p className="text-xl font-bold mb-4 z-10">
                {rate.total.toFixed(1)}/100
            </p>
            <p className="font-semibold text-sm text-center line-clamp-2 z-10">
                {rate.profiles.name} avaliou{" "}
                <span className="font-bold">{album.name}</span>
            </p>

            <p className="text-xs text-neutral-300 text-center mt-4 z-10">
                Veja mais em letterfy.kaizin.com.br
            </p>
        </>
    );
}