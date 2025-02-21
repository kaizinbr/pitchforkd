"use client";

import Avatar from "../ui/Avatar";
import { TbSettings2, TbUserEdit } from "react-icons/tb";

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

    return (
        <>
            <div
                className={`
                        absolute h-[30rem] w-full -z-50 from-40 
                        top-0
                        transition-all duration-200 ease-in-out
                    `}
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${currentColor}, transparent)`,
                }}
            ></div>
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
