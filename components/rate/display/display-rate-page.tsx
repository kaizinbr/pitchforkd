"use client";

import { useEffect, useState } from "react";
import ColorThief from "colorthief";
import { darkenColor } from "@/components/album/gen-gradient";
import axios from "axios";
import AlbumCover from "@/components/album/album-cover";
import AlbumData from "@/components/album/album-data";
import { AlbumRate, Review } from "@/lib/utils/types";
import UserRate from "./user-rate";
import AlbumTracksDisplay from "./display-tracks";
import ShareBtn from "./share-btn";
import Link from "next/link";
import DeleteBtn from "./options";
import { createClient } from "@/utils/supabase/client";
import LikeBtn from "@/components/user/like-btn";
import useScrollDirection from "@/hooks/useScrollDirection";

export default function DisplayRate({
    id,
    rate,
}: {
    id?: string;
    rate: Review;
}) {
    const supabase = createClient();
    const scrollDirection = useScrollDirection();

    const [album, setAlbum] = useState<any>();
    const [tracks, setTracks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [canDelete, setCanDelete] = useState(false);
    const [liked, setLiked] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);
    const [color1, setColor1] = useState<string>("#4a6d73");
    const [color2, setColor2] = useState<string>("#b78972");
    const [color3, setColor3] = useState<string>("#691209");

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(
                `/api/spot/album/${rate.album_id}`
            );
            console.log(response.data);
            setAlbum(response.data);
            setTracks(response.data.tracks.items);

            if (response.data.total_tracks > 50) {
                console.log("Mais de 50 músicas");

                const offsetTimes = Math.ceil(response.data.total_tracks / 50);

                let tracks2: any[] = response.data.tracks.items;

                for (let i = 0; i < offsetTimes; i++) {
                    if (i === 0) {
                        null;
                    } else {
                        const response = await axios.get(
                            `/api/spot/album/${id}/tracks?offset=${i * 50}`
                        );
                        tracks2 = [...tracks2, ...response.data.items];
                        console.log("Offset:", i * 50);
                    }
                }
                console.log("Tracks:", tracks2);
                setTracks(tracks2);
            }

            setLoading(false);

            const img = new Image();
            img.crossOrigin = "anonymous"; // Para evitar problemas de CORS

            img.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    // Agora pode usar o elemento img carregado
                    const dominantColor = colorThief.getColor(img);
                    const palette = colorThief.getPalette(img, 3); // 3 cores

                    console.log("Dominant Color:", dominantColor);
                    console.log("Palette:", palette);

                    setColor1(
                        `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
                    );
                    setColor2(
                        `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
                    );
                    setColor3(
                        `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`
                    );
                } catch (error) {
                    console.error("Erro ao extrair cores:", error);
                }
            };

            img.onerror = () => {
                console.error("Erro ao carregar a imagem");
            };

            // Definir a URL da imagem por último
            img.src = response.data.images[0]?.url;

            setLoading(false);
        };

        const fetchUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (!user) {
                console.error("User not logged in");
                return;
            }

            if (error) {
                console.error(error);
                return;
            }

            console.log(user.id, rate.profiles.id);

            if (user.id === rate.profiles.id) {
                setCanDelete(true);
            }
        };

        const verifyLike = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                console.error("User not logged in");
                return;
            }

            const { data, error } = await supabase
                .from("likes")
                .select("*")
                .eq("user_id", user.id)
                .eq("rating_id", rate.id);

            if (error) {
                console.error(error);
                return;
            }

            if (data.length) {
                setLiked(true);
            }
        };

        const getLikes = async () => {
            const { data, error } = await supabase
                .from("likes")
                .select("*")
                .eq("rating_id", rate.id);

            if (error) {
                console.error(error);
                return;
            }

            setTotalLikes(data.length);
        };

        verifyLike();
        getLikes();
        fetchData();
        fetchUser();
    }, [id]);

    return (
        <>
            {album && (
                <>
                    <div
                        className={`
                            absolute h-36 w-full -z-50 from-40 
                            top-0
                            transition-all duration-200 ease-in-out overflow-hidden
                            bg-blend-screen
                        `}
                        style={{
                            backgroundImage: `linear-gradient(to bottom, ${darkenColor(color1, 0.5)}, transparent)`,
                            // filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                        }}
                    ></div>
                    <div className="flex flex-row w-full items-center gap-4 px-5">
                        <AlbumCover
                            display={true}
                            album={album}
                            loading={loading}
                        />
                        <div className="text-white">
                            <h2 className="text-xl font-bold">{album.name}</h2>
                            <p className="font-medium mb-2">
                                {album.artists.map(
                                    (artist: any, index: number) => (
                                        <Link
                                            href={`/artist/${artist.id}`}
                                            key={artist.id}
                                        >
                                            {artist.name}
                                            {index < album.artists.length - 1 &&
                                                ", "}
                                        </Link>
                                    )
                                )}
                            </p>
                        </div>
                    </div>
                    {canDelete ? <DeleteBtn id={rate.id} /> : null}
                    <ShareBtn shorten={rate.shorten} />
                    <LikeBtn
                        rating_id={rate.id}
                        owner_id={rate.user_id}
                        liked={liked}
                        setLiked={setLiked}
                        totalLikes={totalLikes}
                        setTotalLikes={setTotalLikes}
                        type={"rounded"}
                        className={`
                            p-3
                            flex justify-center items-center
                            bg-main-400 border-2 border-main-400 hover:bg-main-500 hover:border-main-500  
                            ${liked ? "text-red-500" : "!text-white"}
                            rounded-full
                            fixed right-4
                            ${scrollDirection > "down" ? "bottom-20" : "bottom-4"}
                            md:bottom-4
                            transition-all duration-300
                            shadow-md
                        `}
                    />
                    <UserRate
                        review={rate}
                        loading={loading}
                        likes={totalLikes}
                    />
                    {tracks.length > 0 ? (
                        <AlbumTracksDisplay
                            tracks={tracks}
                            loading={loading}
                            ratings={rate.ratings}
                            rate={rate}
                        />
                    ) : null}
                    <div className="w-full px-5">
                        <Link
                            href={`/album/${album.id}`}
                            className={`
                                py-3
                                flex justify-center items-center
                                bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600
                                text-white font-semibold rounded-xl
                                w-full
                                max-w-2xl mx-auto
                                cursor-pointer
                                transition-all duration-300
                            `}
                        >
                            Ver álbum
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
