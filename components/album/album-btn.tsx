import Link from "next/link";
import useScrollDirection from "@/hooks/useScrollDirection";

export default function AlbumBtn({ album }: { album: any }) {
    
    const scrollDirection = useScrollDirection();
    return (
        <Link href={`/album/${album.id}/rate`} className={`
            py-3
            flex justify-center items-center
            bg-orange-400 text-white font-bold rounded-xl
            fixed left-4 right-4
            ${scrollDirection > "down" ? "bottom-20" : "bottom-4"}
            transition-all duration-300
        `}>
            Avaliar álbum
        </Link>
    );
}
