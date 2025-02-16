"use client";

export default function tracksTracks({
    tracks,
    loading,
}: {
    tracks: any;
    loading: boolean;
}) {
    const discTracks = tracks.reduce((acc: any, track: any) => {
        if (!acc[track.disc_number]) {
            acc[track.disc_number] = [];
        }
        acc[track.disc_number].push(track);
        return acc;
    }, {});
    // console.log(discTracks);

    return (
        <div className="w-full max-w-2xl">
            {loading ? (
                <div className=""></div>
            ) : discTracks ? (
                <div className="flex flex-col gap-4">
                    {Object.values(discTracks).map(
                        (disc: any, index: number) => (
                            <div className="mt-5" key={index}>
                                {disc.length > 1 ? (
                                    <h2 className="text-lg font-bold w-full flex p-5">
                                        Disco {index + 1}
                                    </h2>
                                ) : null}
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-neutral-500 uppercase">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="pl-5 py-3"
                                            >
                                                #
                                            </th>
                                            <th
                                                scope="col"
                                                className="p-3"
                                            >
                                                Nome
                                            </th>
                                            <th
                                                scope="col"
                                                className="pr-5 pl-4 py-3 text-end"
                                            >
                                                Tempo
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {disc.map(
                                            (track: any, index: number) => (
                                                <tr
                                                    key={track.id}
                                                    className="bg-transparent hover:bg-neutral-800 md:rounded-xl transition-all duration-200 ease-in-out"
                                                >
                                                    <td className="pl-5 py-4 text-neutral-400">
                                                        {track.track_number}
                                                    </td>
                                                    <td className="px-3 py-4">
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
                                                                            key={
                                                                                artist.id
                                                                            }
                                                                        >
                                                                            {
                                                                                artist.name
                                                                            }
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
                                                    </td>
                                                    <td className="px-4 pr-5 py-4 text-end text-neutral-400">
                                                        <span>
                                                            {Math.floor(
                                                                track.duration_ms /
                                                                    60000
                                                            )}
                                                            :
                                                            {Math.floor(
                                                                (track.duration_ms %
                                                                    60000) /
                                                                    1000
                                                            )
                                                                .toFixed(0)
                                                                .padStart(
                                                                    2,
                                                                    "0"
                                                                )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                    {/* {Object.values(discTracks).map(
                        (disc: any, index: number) => (
                            <div
                                className="flex flex-col gap-5 mt-5"
                                key={index}
                            >
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
                                                <span>
                                                    {track.track_number}
                                                </span>
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
                                                    (track.duration_ms %
                                                        60000) /
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
                    )} */}
                </div>
            ) : null}
        </div>
    );
}
