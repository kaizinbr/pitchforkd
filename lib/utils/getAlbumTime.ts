export default function getAlbumTime(tracks: any) {
    const total = tracks.reduce(
        (total: number, track: any) => total + track.duration_ms,
        0
    );
    const days = Math.floor(total / 86400000);
    const hours = Math.floor((total % 86400000) / 3600000);
    const minutes = Math.floor((total % 3600000) / 60000);

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}