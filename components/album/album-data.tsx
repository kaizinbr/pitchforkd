"use client";
import getAlbumTime from "@/lib/utils/getAlbumTime";
import Link from "next/link";

export default function AlbumData({
    album,
    tracks,
    loading,
    display,
}: {
    album: any;
    tracks: any;
    loading: boolean;
    display?: boolean;
}) {
    return (
        <div className="w-full max-w-2xl px-5">
            {loading ? (
                <div className=""></div>
            ) : (
                <div className="text-white">
                    <h2 className="text-xl font-bold">{album.name}</h2>
                    <p className="font-medium mb-2">
                        {album.artists.map((artist: any, index: number) => (
                            <Link href={`/artist/${artist.id}`} key={artist.id}>
                                {artist.name}
                                {index < album.artists.length - 1 && ", "}
                            </Link>
                        ))}
                    </p>
                    <p className="text-sm">
                        Lançado em{" "}
                        {new Date(
                            album.release_date + "T00:00:00"
                        ).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm flex gap-1">
                        <span className="">
                            {(() => {
                                switch (album.album_type) {
                                    case "album":
                                        return "Álbum";
                                    case "single":
                                        return "Single/EP";
                                    case "compilation":
                                        return "Compilação";
                                    default:
                                        return "Outro";
                                }
                            })()}
                        </span>
                        •<span>{album.total_tracks} músicas</span>•
                        <span>{getAlbumTime(tracks)}</span>
                    </p>
                </div>
            )}
        </div>
    );
}
