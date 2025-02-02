import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RatingCard({
    rating,
    username,
}: {
    rating: { id: string; album_id: string; total: number; ratings: any[] };
    username: string;
}) {
    // const supabase = createClient();
    const [album, setAlbum] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlbum() {
            const response = await axios.get(
                `/api/spot/album/${rating.album_id}`
            );
            console.log(response.data);
            setAlbum(response.data);
            setLoading(false);
        }

        fetchAlbum();
    }, [rating.album_id]);

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : album ? (
                <Link href={`/${username}/rate/${rating.album_id}`}>
                    <h2>{album.name}</h2>
                    <div>{rating.total.toFixed(1)}</div>
                </Link>
            ) : (
                <div>Album not found</div>
            )}
        </div>
    );
}
