"use client";
import getAlbumTime from "@/lib/utils/getAlbumTime";

export default function AlbumData({
    album,
    tracks,
    loading,
}: {
    album: any;
    tracks: any;
    loading: boolean;
}) {
    return (
        <div className="w-full px-5">
            {loading ? (
                <div className=""></div>
            ) : (
                <div className="">
                    <h2 className="text-2xl font-bold">{album.name}</h2>
                    <p className="font-semibold mb-4">
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
                    <p className="text-sm text-neutral-400 flex gap-1">
                        <span>
                            {album.total_tracks} músicas
                        </span>
                        •
                        <span>
                            {getAlbumTime(tracks)}
                        </span>
                    </p>
                </div>
            ) }
        </div>
    );
}
