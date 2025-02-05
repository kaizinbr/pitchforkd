"use client";
import getAlbumTime from "@/lib/utils/getAlbumTime";

export default function AlbumTracks({
    album,
    loading,
}: {
    album: any;
    loading: boolean;
}) {
    const discTracks = album.tracks.items.reduce((acc: any, track: any) => {
        if (!acc[track.disc_number]) {
            acc[track.disc_number] = [];
        }
        acc[track.disc_number].push(track);
        return acc;
    }, {});
    // console.log(discTracks);

    return (
        <div className="w-full px-5">
            {loading ? (
                <div className=""></div>
            ) : album ? (
                <div className="flex flex-col gap-4">
                    {Object.values(discTracks).map(
                        (disc: any, index: number) => (
                            <div className="flex flex-col gap-5 mt-5" key={index}>
                                {disc.length > 1 ? (
                                    <h2 className="text-lg font-bold">
                                        Disco {index + 1}
                                    </h2>
                                ) : null}
                                {disc.map((track: any, index: number) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-1">
                                            <div className="w-8 text-sm text-neutral-400">
                                                <span>{track.track_number}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="text-sm font-semibold">
                                                    {track.name}
                                                </h2>
                                                <p className="text-sm text-neutral-400">
                                                    {track.artists.map(
                                                        (
                                                            artist: any,
                                                            index: number
                                                        ) => (
                                                            <span
                                                                key={artist.id}
                                                            >
                                                                {artist.name}
                                                                {index <
                                                                    track
                                                                        .artists
                                                                        .length -
                                                                        1 &&
                                                                    ", "}
                                                            </span>
                                                        )
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-sm ml-3 text-neutral-400">
                                            <span>
                                                {Math.floor(
                                                    track.duration_ms / 60000
                                                )}
                                                :
                                                {Math.floor(
                                                    (track.duration_ms % 60000) /
                                                        1000
                                                )
                                                    .toFixed(0)
                                                    .padStart(2, "0")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div>No album</div>
            )}
        </div>
    );
}
