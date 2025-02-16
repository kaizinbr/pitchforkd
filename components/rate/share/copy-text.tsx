import { Review, Album, Track } from "@/lib/utils/types";
import formatRate from "@/lib/utils/formatRate";

export default function CopyText({
    rate,
    album,
}: {
    rate: Review;
    album: Album;
}) {
    return (
        <div className="w-full max-w-2xl px-5">
            <div className="p-4 w-full bg-neutral-800 rounded-xl">
                <p className="mb-3">Avaliação de {rate.profiles.name}</p>
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
                                    {rating.value}/100 {rating.favorite ? "✨" : ""}{" "}
                                </p>
                            )}
                        </div>
                    );
                })}
                {rate.review == "" ? null : <p className="mt-3">Comentários: {rate.review}</p>}
                <button
                    className="mt-4 p-2 bg-orange-500 text-white rounded-xl w-full cursor-pointer"
                    onClick={() => {
                        const textToCopy = `Avaliação de ${rate.profiles.name}\n\n${album.name} – ${album.artists[0].name} – ${formatRate(rate.total)}\n\n${rate.ratings
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
                            )}\n\n${rate.review ? `Comentários: ${rate.review}` : ""}`;
                        navigator.clipboard.writeText(textToCopy);
            
                    }}
                >
                    Copy to Clipboard
                </button>
            </div>
        </div>
    );
}
