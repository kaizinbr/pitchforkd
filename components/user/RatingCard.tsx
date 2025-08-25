/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@mantine/core";
import Avatar from "@/components/ui/Avatar";
import { Review, Content } from "@/lib/utils/types";
import { createClient } from "@/utils/supabase/client";
import { displayPastRelativeTime } from "@/lib/utils/time";
import axios from "axios";
import formatRate from "@/lib/utils/formatRate";
import LikeBtn from "./like-btn";
import ColorThief from "colorthief";
import { darkenColor } from "@/components/album/gen-gradient";

import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextareaDisplay from "../textaera-content";

export default function RatingCard({
    review,
    edit,
    album,
}: {
    review: Review;
    edit?: boolean;
    album: any;
}) {
    const supabase = createClient();
    // const [album, setAlbum] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [hasContent, setHasContent] = useState(false);

    const [color1, setColor1] = useState<string>("#4a6d73");

    const content =
        review.content &&
        (review.content as Content).content.length > 1 &&
        (review.content as Content).content[0]?.content[0].text === ""
            ? ""
            : review.content;

    // console.log("album:", album);

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: content,
        editable: false,
        immediatelyRender: false,
    });

    useEffect(() => {
        if (review.content) {
            const content = review.content as Content;

            console.log("Content:", content);

            // Verifica se existe conteúdo significativo no campo "text"
            if (
                !content ||
                !(content as Content).content ||
                (content as Content).content.length === 0 ||
                !Array.isArray((content as Content).content[0]?.content) ||
                ((content as Content).content[0]?.content.length === 1 &&
                    ((content as Content).content[0]?.content[0]?.text ??
                        "") === "")
            ) {
                setHasContent(false);
            } else {
                setHasContent(true);
            }

            // console.log("Has Content:", hasContent);
        }
    }, [review.content]);

    useEffect(() => {
        if (album) {
            // console.log("Album:", album);
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
                } catch (error) {
                    console.error("Erro ao extrair cores:", error);
                }
            };

            img.onerror = () => {
                console.error("Erro ao carregar a imagem");
            };

            // Definir a URL da imagem por último
            img.src = album.images[1].url;

            setLoading(false);
        }
    }, [album]);

    // useEffect(() => {
    //     const verifyLike = async () => {
    //         const {
    //             data: { user },
    //         } = await supabase.auth.getUser();
    //         if (!user) {
    //             console.error("User not logged in");
    //             return;
    //         }

    //         const { data, error } = await supabase
    //             .from("likes")
    //             .select("*")
    //             .eq("user_id", user.id)
    //             .eq("rating_id", review.id);

    //         if (error) {
    //             console.error(error);
    //             return;
    //         }

    //         if (data.length) {
    //             setLiked(true);
    //         }
    //     };

    //     verifyLike();
    // }, [review.id]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await axios.get(
    //             `/api/spot/album/${review.album_id}`
    //         );
    //         setAlbum(response.data);
    //         setLoading(false);
    //     };

    //     fetchData();
    // }, [review.album_id]);

    return (
        <>
            {loading ? (
                <div
                    className={`
                        flex flex-col 
                        max-w-2xl w-full
                        transition-all duration-200 ease-in-out   
                        overflow-hidden relative
                        p-5
                `}
                >
                    <div className="z-20">
                        <div className="flex flex-row items-center gap-2">
                            <Skeleton height={32} circle />
                            <div className="flex w-[calc(100%-40px)] items-start justify-center flex-col gap-2">
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" width="70%" />
                            </div>
                        </div>

                        <div className="flex flex-row relative rounded-2xl my-3 overflow-hidden">
                            <Skeleton height={160} width={160} radius="lg" />
                            <div
                                className={`
                                flex flex-col justify-start items-start px-3 gap-2
                                w-[calc(100%-160px)]
                            `}
                            >
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} radius="xl" width="70%" />
                            </div>
                        </div>
                        <div className="flex items-center justify-start flex-row gap-2">
                            <span className=" h-full flex items-center text-xs text-stone-400 "></span>
                        </div>
                    </div>
                </div>
            ) : album ? (
                <div
                    className={`
                        flex flex-col 
                        max-w-2xl w-full
                        overflow-hidden relative
                        review-${review.id}
                        z-20
                `}
                >
                    <div
                        className={`
                            z-20 size-full bor border-shark-900 p-4 relative
                            md:rounded-2xl
                            bg-transparent hover:bg-shark-900
                            transition-all duration-200 ease-in-out   
                        `}
                    >
                        <Link
                            href={`/r/${review.shorten}`}
                            className={`
                            flex flex-row
                            `}
                        >
                            <div className="flex relative flex-col justify-center items-center size-8 rounded-full w-8 h-8 mr-3">
                                <Avatar
                                    size={32}
                                    src={review.profiles.avatar_url}
                                    className={"size-8"}
                                    isIcon
                                />
                            </div>

                            <div className="flex flex-col gap-3 w-9/10 max-w-9/10">
                                <h2 className="text-sm text-neutral-100 font-medium">
                                    <span className="">
                                        {review.profiles.name ||
                                            review.profiles.username}{" "}
                                        avaliou
                                    </span>{" "}
                                    <span className="font-bold">
                                        {album && album.name}
                                    </span>{" "}
                                    <span className="">de</span>{" "}
                                    <span className="font-bold">
                                        {album && album.artists[0].name}
                                    </span>
                                </h2>
                                {hasContent && (
                                    <div className="flex w-full -mt-2">
                                        {review.content && (
                                            <TextareaDisplay
                                                editor={editor}
                                                lineClamp={6}
                                            />
                                        )}
                                    </div>
                                )}
                                <div className={`
                                        flex flex-row relative p-4 bg-shark-900 border border-shark-800 rounded-xl overflow-hidden
                                        
                                    `}
                                        style={{
                                            backgroundImage: `linear-gradient(to right, ${darkenColor(color1, 0.5)} 20%, #282b30 100%)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            
                                        }}
                                    >
                                    {album && (
                                        <picture className="relative size-40">
                                            <NextImage
                                                src={album.images[1].url}
                                                alt={album.name}
                                                width={500}
                                                height={500}
                                                className="  object-cover z-10 size-40 max-h-[160px] rounded-lg opacity-"
                                            />

                                        </picture>
                                    )}
                                    <div
                                        className={`
                                            flex flex-col justify-start items-start px-3 gap-2
                                            w-[calc(100%-160px)]
                                        `}
                                    >
                                        <span className="text-neutral-100 text-2xl font-extrabold">
                                            {formatRate(review.total)}
                                        </span>

                                        <span className="text-neutral-300 text-xs">
                                            {review.ratings.length} músicas
                                            avaliadas
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between flex-row gap-2">
                                    <span className=" h-full flex items-center text-xs text-shark-400 ">
                                        {displayPastRelativeTime(
                                            new Date(review.created_at)
                                        )}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        {/* <LikeBtn
                            rating_id={review.id}
                            owner_id={review.user_id}
                            liked={liked}
                            setLiked={setLiked}
                            className="absolute bottom-5 right-5"
                        /> */}
                    </div>
                </div>
            ) : (
                <div>Album not found</div>
            )}
        </>
    );
}
