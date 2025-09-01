'use client';
const lastfmurl = "https://ws.audioscrobbler.com/2.0/";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Favorites() {
    const [favorites, setFavorites] = useState<Array<{ name: string; "@attr": { rank: string } }>>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const { data } = await axios.get(`${lastfmurl}?method=user.gettopalbums&user=kaizinbr&api_key=f6bd5351649c166b1bdd208c44fa2d3b&period=1month&format=json`);
            setFavorites(data.topalbums.album);
            console.log(data.topalbums);
        };

        fetchFavorites();
        console.log(favorites);
    }, []);

    return (
        <div>
            {favorites.length > 0 ? (
                <ul>
                    {favorites.map((album) => (
                        <li key={album["@attr"].rank}>{album.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No favorite albums found.</p>
            )}
        </div>
    );
}