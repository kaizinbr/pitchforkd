export default function getAlbumTime(tracks: any) {
    const total = tracks.reduce(
        (total: number, track: any) => total + track.duration_ms,
        0
    );
    const hours = Math.floor(total / 3600000);
    const minutes = Math.floor(total / 60000);
    const seconds = ((total % 60000) / 1000).toFixed(0);
    return hours > 0
        ? `${hours}h ${minutes}m`
        : `${minutes}m`;


}