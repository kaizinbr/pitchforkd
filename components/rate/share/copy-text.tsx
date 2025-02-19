import { Review, Album, Track } from "@/lib/utils/types";
import formatRate from "@/lib/utils/formatRate";
import Link from "next/link";

export default function CopyText({
    rate,
    album,
}: {
    rate: Review;
    album: Album;
}) {
    return (
        <div className="w-full max-w-2xl px-5">
            <div className="p-4 w-full bg-bunker-800 rounded-xl">
                <p className="mb-3">Avaliação de {rate.profiles.name || rate.profiles.username}</p>
                <p className="mb-3">
                    {album.name} – {album.artists[0].name} –{" "}
                    {formatRate(rate.total)}
                </p>
                {rate.ratings.map((rating, index) => {
                    const track: Track | undefined = album.tracks.items.find(
                        (item) => item.id === rating.id
                    );
                    return (
                        <div key={index} className="flex flex-row gap-2">
                            {track && (
                                <p>
                                    {track.track_number}. {track.name} –{" "}
                                    {rating.value}/100{" "}
                                    {rating.favorite ? "✨" : ""}{" "}
                                </p>
                            )}
                        </div>
                    );
                })}
                {rate.review == "" ? null : (
                    <p className="mt-3">Comentários: {rate.review}</p>
                )}
                <p className="mt-3">
                    Veja mais em{" "}
                    <Link href={`https://pitchforkd.me/r/${rate.shorten}`} target="_blank">
                        pitchforkd.me/r/{rate.shorten}
                    </Link>
                </p>
                <button
                    className="mt-4 p-2 !font-semibold bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600  text-white rounded-xl w-full cursor-pointer"
                    onClick={() => {
                        const textToCopy = `Avaliação de ${rate.profiles.name || rate.profiles.username}\n\n${album.name} – ${album.artists[0].name} – ${formatRate(rate.total)}\n\n${rate.ratings
                            .map((rating, index) => {
                                const track = album.tracks.items.find(
                                    (item) => item.id === rating.id
                                );
                                return track
                                    ? `${track.track_number}. ${track.name} – ${rating.value}/100 ${rating.favorite ? "✨" : ""}`
                                    : "";
                            })
                            .join(
                                "\n"
                            )}${rate.review ? `\n\nComentários: ${rate.review}` : ""}
                            \nVeja mais em https://pitchforkd.me/r/${rate.shorten}`;
                        navigator.clipboard.writeText(textToCopy);
                    }}
                >
                    Copiar
                </button>
            </div>
        </div>
    );
}
