"use client";

import { Rating } from "@/lib/utils/types";

export default function tracksTracksDisplay({
    tracks,
    loading,
    ratings,
}: {
    tracks: any;
    loading: boolean;
    ratings: Rating[];
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
        <div className="w-full">
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
                                                className="px-2 py-3"
                                            >
                                                Nome
                                            </th>
                                            <th
                                                scope="col"
                                                className="pr-5 pl-4 py-3 text-end"
                                            >
                                                Nota
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {disc.map(
                                            (track: any, index: number) => (
                                                <tr
                                                    key={track.id}
                                                    className="bg-transparent hover:bg-neutral-800 transition-all duration-200 ease-in-out"
                                                >
                                                    <td className="pl-5 py-4 text-neutral-400">
                                                        {track.track_number}
                                                    </td>
                                                    <td className="px-2 py-4">
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
                                                    <td className="px-4 pr-5 py-4 text-end font-bold">
                                                        <span>
                                                            {
                                                                ratings.find(
                                                                    (rating) =>
                                                                        rating.id ===
                                                                        track.id
                                                                )?.value
                                                            }
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
                </div>
            ) : null}
        </div>
    );
}
