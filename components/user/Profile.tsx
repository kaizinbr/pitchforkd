"use client";

import Avatar from "../ui/Avatar";
import AvatarEdit from "../firstLogin/AvatarEdit";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Profile({
    user,
    isUser,
}: {
    user: any;
    isUser: boolean;
}) {
    console.log("sou eu?", isUser, user);
    const [currentColor, setCurrentColor] = useState<string>("#");

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
            <div className="flex flex-col gap-4 items-center w-full">
                <picture className="flex items-center justify-center mt-48">
                    {/* {isUser ? (
                        <AvatarEdit
                            size={176}
                            src={user.avatar_url}
                            uid={null}
                            onUpload={function (src: string): void {
                                console.log("Function not implemented.");
                            }}
                        />
                    ) : ( */}
                    <Avatar size={120} src={user.avatar_url} />
                    {/* )} */}
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
                    {/* <p className="mb-2  text-center">
                        {user.bio} Lorem ipsum dolor sit amet consectetur
                        adipisicing elit. Expedita commodi ea iusto. Id expedita
                        incidunt accusamus fugiat, cupiditate unde deleniti
                        alias, quod a aspernatur repudiandae laboriosam ipsam
                        iste corrupti voluptates.
                    </p> */}
                </div>
            </div>
        </>
    );
}
