"use client";

import Avatar from "@/components/ui/Avatar";
import {
    TbSettings2,
    TbUserEdit,
    TbRosetteDiscountCheckFilled,
} from "react-icons/tb";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Profile({
    user,
    reviewCount,
    isUser,
}: {
    user: any;
    reviewCount: number;
    isUser: boolean;
}) {
    const [currentColor, setCurrentColor] = useState<string>("#F17105");
    const [colorsArray, setColorsArray] = useState<any[]>([]);
    const [gradient, setGradient] = useState<string>("");

    function hexToRgba(hex: string, alpha = 1) {
        const bigint = parseInt(hex.replace("#", ""), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return (
        <>
            {/* <div
                className={`
                        absolute h-[30rem] w-full -z-50 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${currentColor}80, transparent)`,
                }}
            ></div> */}
            {isUser && (
                <div className="absolute top-0 md:top-20 w-full max-w-2xl mx-auto flex flex-row justify-end gap-3 p-5 md:p-0">
                    <Link href={`/edit`} className="">
                        <TbUserEdit className="size-6" />
                    </Link>
                    <Link href={`/settings`} className="">
                        <TbSettings2 className="size-6" />
                    </Link>
                </div>
            )}
            <div className="flex flex-col gap-4 items-center w-full mt-18 md:mt-28 px-5  max-w-2xl">
                <picture className="flex items-center justify-center">
                    <Avatar
                        size={120}
                        src={user.avatar_url}
                        setCurrentColor={setCurrentColor}
                    />
                </picture>
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-lg font-bold text-center flex flex-row items-center gap-1">
                        {user.name}{" "}
                        {user.verified && (
                            <TbRosetteDiscountCheckFilled className="size-5 text-main-500" />
                        )}
                    </h1>
                    <p className="text-base font-semibold text-neutral-300 text-center">
                        @{user.username}
                    </p>
                    {!user.pronouns && !user.site ? null : (
                        <div className="flex flex-row gap-1 text-xs font-medium text-neutral-300 text-center mt-1">
                            {user.pronouns && (
                                <span className="">{user.pronouns}</span>
                            )}
                            {user.pronouns && user.site && <span>•</span>}
                            {user.site && (
                                <Link
                                    href={`https://${user.site}`}
                                    className={`
                                         underline
                                    `}
                                    target="_blank"
                                >
                                    {user.site || ""}
                                </Link>
                            )}
                        </div>
                    )}
                    <p className="text-xs font-medium text-neutral-300 text-center mt-1">
                        {reviewCount} avaliações
                    </p>
                </div>
            </div>
        </>
    );
}
