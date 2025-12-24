import axios from "axios";

export const spotifyInstance = axios.create({
    baseURL: "https://api.spotify.com/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});

export const localApiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});