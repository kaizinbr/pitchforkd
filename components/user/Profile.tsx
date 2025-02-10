"use client";

import Avatar from "../ui/Avatar";
import { TbSettings2, TbUserEdit } from "react-icons/tb";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Profile({
    user,
    isUser,
}: {
    user: any;
    isUser: boolean;
}) {
    const [currentColor, setCurrentColor] = useState<string>("#F17105");

    return (
        <>
            <div
                className={`
                        absolute h-[30rem] w-lvw -z-50 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${currentColor}, transparent)`,
                }}
            ></div>
            <div className="absolute top-4 right-4 left-4 flex flex-row justify-end gap-3">
                <Link href={`${user.username}/edit`} className="">
                    <TbUserEdit className="size-6" />
                </Link>
                <Link href={`${user.username}/settings`} className="">
                    <TbSettings2 className="size-6" />
                </Link>
            </div>
            <div className="flex flex-col gap-4 items-center w-full">
                <picture className="flex items-center justify-center mt-48">
                    <Avatar
                        size={120}
                        src={user.avatar_url}
                        setCurrentColor={setCurrentColor}
                    />
                </picture>
                <div className="flex flex-col items-center w-full px-5">
                    <h1 className="text-lg font-bold text-center">
                        {user.name}
                    </h1>
                    <p className="text-base font-semibold text-neutral-300 text-center">
                        @{user.username}
                    </p>
                    {user.pronouns && (
                        <p className="text-sm font-semibold text-neutral-300 text-center">
                            {user.pronouns}
                        </p>
                    )}

                    {user.site && (
                        <div className="flex flex-row text-sm text-woodsmoke-200 items-center gap-1">
                            <Link
                                href={`https://${user.site}`}
                                className={`
                                    text-sm font-semibold text-neutral-300 text-center underline
                                `}
                                target="_blank"
                            >
                                {user.site || ""}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
