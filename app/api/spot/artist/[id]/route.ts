import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const getAccessToken = async () => {
    const authorization = Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID ?? ""}:${
            process.env.SPOTIFY_CLIENT_SECRET ?? ""
        }`
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
        }
    );
    // console.log(response.data);

    (await cookies()).set("spotify_token", response.data.access_token, {
        path: "/",
        maxAge: 3600,
        sameSite: "lax",
    });

    return response.data.access_token;
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id; 
    console.log(id);

    const cookieStore = await cookies();
    const hasCookie = cookieStore.has("spotify_token");
    let token = hasCookie
        ? cookieStore.get("spotify_token")!.value
        : await getAccessToken();

    const response = await axios.get(
        `https://api.spotify.com/v1/artists/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return NextResponse.json(response.data);
}
