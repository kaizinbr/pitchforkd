"use client";

import Avatar from "@/components/ui/Avatar";
import { darkenColor } from "@/components/album/gen-gradient";
import {
    TbSettingsFilled,
    TbFlagFilled,
    TbRosetteDiscountCheckFilled,
    TbDots
} from "react-icons/tb";

import { PiShareFatFill } from "react-icons/pi";

import { useState, useEffect } from "react";
import Link from "next/link";
import FollowBtn from "@/components/user/FollowBtn";
import Favorites from "@/components/user/FavoritesHeader";

export default function UserHeader({
    profile,
    reviewCount,
    isUser,
    followersCount,
    followingCount,
}: {
    profile: any;
    reviewCount: number;
    isUser: boolean;
    followersCount: number;
    followingCount: number;
}) {
    const [colors, setColors] = useState<string[]>([
        "#4a6d73",
        "#b78972",
        "#691209",
    ]);

    return (
        <>
            <div
                className={`
                    absolute h-100 w-full -z-50 from-40 
                    top-0
                    transition-all duration-200 ease-in-out overflow-hidden
                    bg-blend-screen
                `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${darkenColor(colors[0], 1.5)}, transparent)`,
                    filter: ` brightness(0.7) contrast(1.2) saturate(1.5)`,
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center blur-3xl md:m-auto md:max-w-lg">
                    <div
                        style={{ backgroundColor: colors[0] }}
                        className={`absolute rounded-full bg-[${colors[0]}] size-100 -top-2/3 -left-1/4 blur-3xl`}
                    ></div>
                    <div
                        style={{ backgroundColor: colors[2] }}
                        className={`absolute rounded-full -right-1/4 -top-2/3 w-80 h-100 blur-3xl`}
                    ></div>
                    <div
                        style={{ backgroundColor: colors[1] }}
                        className={`absolute rounded-full -top-2 h-40 w-88 -rotate-45 blur-3xl`}
                    ></div>
                </div>
            </div>
            {isUser ? (
                <div className="absolute top-0 md:top-20 w-full max-w-2xl mx-auto flex flex-row justify-end gap-3 p-5 md:p-0">
                    <Link href={`/edit`} className="">
                        <PiShareFatFill className="size-6" />
                    </Link>
                    <Link href={`/settings`} className="">
                        <TbSettingsFilled className="size-6" />
                    </Link>
                </div>
            ) : 
                <div className="absolute top-0 md:top-20 w-full max-w-2xl mx-auto flex flex-row justify-end gap-3 p-5 md:p-0">
                    <Link href={`#`} className="">
                        <TbFlagFilled className="size-6" />
                    </Link>
                    <Link href={`#`} className="">
                        <PiShareFatFill className="size-6" />
                    </Link>
                </div>}
            <div className="flex flex-col gap-4 items-center w-full mt-14 md:mt-24 px-5  max-w-2xl">
                <picture className="flex items-center justify-center relative">
                    <Avatar
                        size={120}
                        src={profile.avatarUrl}
                        setColors={setColors}
                    />
                    {profile.pronouns && (
                        <span className="absolute -bottom-3 text-xs bg-main-500 px-2 py-[2px] rounded-md">
                            {profile.pronouns}
                        </span>
                    )}
                </picture>
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-lg font-bold text-center flex flex-row items-center gap-1">
                        {profile.name}{" "}
                        {profile.verified && (
                            <TbRosetteDiscountCheckFilled className="size-5 text-main-500" />
                        )}
                    </h1>
                    <p className="text-sm font-semibold text-neutral-400 text-center">
                        @{profile.username}
                    </p>
                    {!profile.pronouns && !profile.site ? null : (
                        <div className="flex flex-row gap-1 text-xs font-medium text-neutral-300 text-center mt-1">
                            {profile.pronouns && profile.site && <span>•</span>}
                            {profile.site && (
                                <Link
                                    href={`https://${profile.site}`}
                                    className={`
                                         underline
                                    `}
                                    target="_blank"
                                >
                                    {profile.site || ""}
                                </Link>
                            )}
                        </div>
                    )}
                    <div className="flex flex-row gap-4 text-xs font-medium text-neutral-300 mt-1">
                        <p className="text-xs font-medium text-neutral-300 text-center">
                            {reviewCount} avaliaç
                            {reviewCount !== 1 ? "ões" : "ão"}
                        </p>
                        <Link
                            href={`/${profile.username}/followers`}
                            className="hover:underline"
                        >
                            {followersCount} seguidor
                            {followersCount !== 1 ? "es" : ""}
                        </Link>
                        <Link
                            href={`/${profile.username}/following`}
                            className="hover:underline"
                        >
                            {followingCount} seguindo
                        </Link>
                    </div>
                </div>
            </div>

            <FollowBtn profile={profile} isUser={isUser} />
            {/* <Favorites favorites={profile.favorites} isUser={isUser} /> */}
        </>
    );
}
