"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { extractColors } from "extract-colors";
import axios from "axios";

export default function AlbumCover({
    album,
    loading,
}: {
    album: any;
    loading: boolean;
}) {

    return (
        <>
            
            <div className="w-full my-16 flex justify-center items-center">
                {loading ? (
                    <div className="size-64 rounded-xl bg-neutral-500"></div>
                ) : album ? (
                    <picture>
                        <Image
                            src={album.images[0]?.url}
                            alt={album.name}
                            width={256}
                            height={256}
                            className="rounded-xl size-64 shadow-lg"
                        />
                    </picture>
                ) : (
                    <div>No album</div>
                )}
            </div>
        </>
    );
}
