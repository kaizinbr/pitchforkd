import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import axios from "axios";
import { cookies } from "next/headers";
import { Vibrant } from "node-vibrant/node";

const getAccessToken = async () => {
    const authorization = Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID ?? ""}:${
            process.env.SPOTIFY_CLIENT_SECRET ?? ""
        }`,
    ).toString("base64");
    const data = new URLSearchParams();
    data.append("grant_type", "client_credentials");

    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        data,
        {
            headers: {
                Authorization: `Basic ${authorization}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    );
    // console.log(response.data);

    (await cookies()).set("spotify_token", response.data.access_token, {
        path: "/",
        maxAge: 3600,
        sameSite: "lax",
    });

    return response.data.access_token;
};

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const hasCookie = cookieStore.has("spotify_token");
    let token = hasCookie
        ? cookieStore.get("spotify_token")!.value
        : await getAccessToken();

    const playlistRaw = await axios.get(
        `https://api.spotify.com/v1/playlists/2O9pEkFOR1qDlCRxZYless`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    // console.log("Playlist raw data:", playlistRaw.data);

    const response = await Promise.all(
        playlistRaw.data.tracks.items.map(async (item: any) => {
            try {
                const palette = await Vibrant.from(
                    item.track.album.images[2].url,
                ).getPalette();
            // console.log("Extracted palette for", item.track.album.name, ":", palette);

            const darkVibrant = palette.DarkVibrant?.hex || "#1B3955";
            const lightVibrant = palette.LightVibrant?.hex || "#A8B8C4";
            const titleTextColor = palette.Vibrant?.titleTextColor || "#FFFFFF";

            return {
                title: item.track.album.name,
                artist: item.track.album.artists[0].name,
                src:
                    item.track.album.images[0]?.url,
                darkVibrant: darkVibrant,
                lightVibrant: lightVibrant,
                text:
                    titleTextColor === "#FFFFFF" ? "text-white" : "text-black",
                album_id: item.track.album.id,
            };
        } catch (error) {
            console.error("Error extracting colors:", error);
            return {
                title: item.track.album.name,
                artist: item.track.album.artists[0].name,
                src:
                    item.track.album.images[1]?.url ||
                    item.track.album.images[0]?.url,
                darkVibrant: "#1B3955",
                lightVibrant: "#A8B8C4",
                text: "text-white",
                album_id: item.track.album.id,
            };
        }
    }));

    console.log("Response with color extraction promises:", response);

    return NextResponse.json(response);
}
