"use client";
import getAlbumTime from "@/lib/utils/getAlbumTime";

export default function AlbumData({
    album,
    loading,
}: {
    album: any;
    loading: boolean;
}) {
    return (
        <div className="w-full px-5">
            {loading ? (
                <div className=""></div>
            ) : album ? (
                <div className="">
                    <h2 className="text-2xl font-bold">{album.name}</h2>
                    <p className="font-semibold">
                        {album.artists.map((artist: any, index: number) => (
                            <span key={artist.id}>
                                {artist.name}
                                {index < album.artists.length - 1 && ", "}
                            </span>
                        ))}
                    </p>
                    <p className="text-sm text-neutral-400">
                        Lançado em{" "}
                        {new Date(album.release_date).toLocaleDateString(
                            "pt-BR"
                        )}
                    </p>
                    <p className="text-sm text-neutral-400">
                        {album.total_tracks} músicas
                    </p>
                    <p className="text-sm text-neutral-400">
                        {getAlbumTime(album.tracks.items)}
                    </p>
                </div>
            ) : (
                <div>No album</div>
            )}
        </div>
    );
}
