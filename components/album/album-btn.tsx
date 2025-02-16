import Link from "next/link";
import useScrollDirection from "@/hooks/useScrollDirection";

export default function AlbumBtn({
    album,
    loading,
}: {
    album: any;
    loading: boolean;
}) {
    
    const scrollDirection = useScrollDirection();
    return (
        <>
            {loading ? (
                <div className=""></div>
            ) :  (
                <Link href={`/album/${album.id}/rate`} className={`
                    py-3
                    flex justify-center items-center
                    bg-orange-400 text-white font-bold rounded-xl
                    fixed left-4 right-4
                    max-w-2xl mx-auto
                    ${scrollDirection > "down" ? "bottom-20" : "bottom-4"}
                    md:bottom-4
                    transition-all duration-300
                `}>
                    Avaliar álbum
                </Link>
            ) }
        </>
    );
}
