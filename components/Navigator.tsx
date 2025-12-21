"use client";
import { Profile } from "@/lib/utils/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Indicator } from "@mantine/core";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    TbUserFilled,
    TbBellFilled,
} from "react-icons/tb";
import localFont from "next/font/local";

import useScrollDirection from "@/hooks/useScrollDirection";

import { type User } from "@supabase/supabase-js";

const FFDisplay = localFont({
    src: [
        {
            path: "../public/fonts/p/FeatureFlatDisplay-Bold-Web.woff2",
            weight: "bold",
            style: "normal",
        },
        {
            path: "../public/fonts/p/FeatureFlatDisplay-BoldItalic-Web.woff2",
            weight: "bold",
            style: "italic",
        },
    ],
});

export default function Navigator({ profile }: { profile: Profile | null }) {
    const pathname = usePathname();
    const supabase = createClient();

    const [username, setUsername] = useState<string | null>(profile?.username ?? null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
    const [hasNotifications, setHasNotifications] = useState<boolean>(false);
    const scrollDirection = useScrollDirection();

    const [localNotifications, setLocalNotifications] = useState<any[]>([]);


    return (
        <div className="relative md:hidden">
            <nav
                className={`
                    fixed
                    ${scrollDirection > "down" ? "bottom-0" : "-bottom-24"}
                    transition-all duration-300 z-[999]
                    left-0 flex w-full items-center justify-evenly
                    backdrop-blur-xl
                    bg-shark-950/70  
                    
                `}
            >
                <button>
                    <Link
                        data-active={pathname === "/home"}
                        href={`/home`}
                        className={`
                                flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                data-[active=true]:text-main-500
                                hover:text-main-500
                                transition-all duration-200 ease-in-out
                            `}
                    >
                        <Icon type="home" className="h-5" />
                    </Link>
                </button>
                <button>
                    <Link
                        data-active={pathname === "/explore" || pathname === "/search"}
                        href={`/explore`}
                        className={`
                                flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                data-[active=true]:text-main-500
                                hover:text-main-500
                                transition-all duration-200 ease-in-out
                            `}
                    >
                        <Icon type="search" className="h-5" />
                    </Link>
                </button>
                {/* <button>
                    <Link
                        data-active={pathname === "/notifications"}
                        href={`/notifications`}
                        className={`
                                flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                data-[active=true]:text-main-500
                                hover:text-main-500
                                transition-all duration-200 ease-in-out
                            `}
                            onClick={() => setHasNotifications(false)}
                    >
                        <Indicator
                            inline
                            size={12}
                            offset={7}
                            position="top-end"
                            color="#00ac1c"
                            withBorder
                            disabled={!hasNotifications}
                        >
                            <TbBellFilled className="size-6" />
                        </Indicator>
                    </Link>
                </button> */}
                <button>
                    <Link
                        data-active={
                            pathname === "/me" || pathname === `${username}`
                        }
                        href={username ? `/${username}` : "/me"}
                        className={`
                                flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                data-[active=true]:text-main-500
                                hover:text-main-500
                                transition-all duration-200 ease-in-out
                            `}
                    >
                        {avatar_url ? (
                            <Avatar size={24} src={avatar_url} isIcon={true} />
                        ) : (
                            <TbUserFilled className="size-6" />
                        )}
                    </Link>
                </button>
            </nav>
        </div>
    );
}

export function DesktopNavigator({ profile }: { profile: Profile | null }) {
    const pathname = usePathname();
    const supabase = createClient();

    const [name, setName] = useState<string | null>(profile?.name ?? null);
    const [username, setUsername] = useState<string | null>(profile?.username ?? null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);
    const scrollDirection = useScrollDirection();


    return (
        <div className="relative hidden md:block">
            <nav
                className={`
                    fixed
                    ${scrollDirection > "down" ? "top-0" : "-top-24"}
                    transition-all duration-300 z-[999]
                    left-0 flex w-full items-center justify-evenly
                    backdrop-blur-xl
                    bg-shark-950/70 h-16
                    px-6 py-1
                `}
            >
                <div className="max-w-4xl flex flex-row w-full justify-between items-center">
                    <div
                        className={`
                        flex flex-row items-center justify-evenly
                    `}
                    >
                        {/* <Link
                            href={`https://pitchforkd.me/`}
                            className={FFDisplay.className + ` font-bold mr-8 text-xl`}
                        >
                            <Image src="/logo.svg" alt="LOOPI" width={64} height={32} />
                        </Link> */}
                        <button>
                            <Link
                                data-active={pathname === "/home"}
                                href={`/home`}
                                className={`
                                    flex  basis-0 cursor-pointer
                                    flex-col items-center gap-1 rounded-8 p-3
                                    data-[active=true]:text-main-500
                                    hover:text-main-500
                                    transition-all duration-200 ease-in-out
                                `}
                            >
                                <Icon type="home" className="h-5" />
                            </Link>
                        </button>
                        <button>
                            <Link
                                data-active={pathname === "/explore" || pathname === "/search"}
                                href={`/explore`}
                                className={`
                                    flex  basis-0 cursor-pointer
                                    flex-col items-center gap-1 rounded-8 p-3
                                    data-[active=true]:text-main-500
                                    hover:text-main-500
                                    transition-all duration-200 ease-in-out
                                `}
                            >
                                <Icon type="search" className="h-5" />
                            </Link>
                        </button>
                        <button>
                            <Link
                                data-active={pathname === "/notifications"}
                                href={`/notifications`}
                                className={`
                                    flex cursor-pointer
                                    flex-col items-center gap-1 rounded-8 p-3
                                    data-[active=true]:text-main-500
                                    hover:text-main-500
                                    transition-all duration-200 ease-in-out
                                `}
                            >
                                <TbBellFilled className="size-6" />
                            </Link>
                        </button>
                    </div>

                    <button className="">
                        <Link
                            data-active={
                                pathname === "/me" || pathname === `${username}`
                            }
                            href={username ? `/${username}` : "/me"}
                            className={`
                                flex basis-0 cursor-pointer
                                flex-row items-center gap-2
                                py-3 pl-4
                                data-[active=true]:text-main-500
                                hover:text-main-500
                                transition-all duration-200 ease-in-out
                            `}
                        >
                            {avatar_url ? (
                                <>
                                    <div className="flex flex-col items-end justify-center">
                                        <span className="text-xs font-semibold">
                                            {name}
                                        </span>
                                        <span className="text-[10px] font-light">
                                            {`@${username}`}
                                        </span>
                                    </div>
                                    <Avatar
                                        size={36}
                                        src={avatar_url}
                                        isIcon={true}
                                    />
                                </>
                            ) : (
                                <TbUserFilled className="size-6" />
                            )}
                        </Link>
                    </button>
                </div>
            </nav>
        </div>
    );
}
