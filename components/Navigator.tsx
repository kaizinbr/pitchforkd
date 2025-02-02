"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    TbUserFilled,
    TbBellFilled,
    TbFolderFilled,
    TbPlus,
} from "react-icons/tb";

// import { motion } from "framer-motion";

import useScrollDirection from "@/hooks/useScrollDirection";

import { type User } from "@supabase/supabase-js";

export default function Navigator({ user }: { user: User | null }) {
    const pathname = usePathname();
    const supabase = createClient();

    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const scrollDirection = useScrollDirection();

    const getProfile = useCallback(async () => {
        try {

            const { data, error, status } = await supabase
                .from("profiles")
                .select(`full_name, username, website, avatar_url`)
                .eq("id", user?.id)
                .single();

            if (error && status !== 406) {
                console.log(error);
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
            }

            // console.log(data);
        } catch (error) {
            console.log("Error loading user data!");
        } 
    }, [user, supabase]);

    useEffect(() => {
        getProfile();
    }, [user, getProfile]);

    return (
        <div className="relative">
            <nav
                className={`
                    fixed
                    ${scrollDirection > "down" ? "bottom-0" : "-bottom-24"}
                    transition-all duration-300 z-[999]
                    left-0 flex w-full items-center justify-evenly
                    backdrop-blur-xl
                    bg-neutral-900/70  
                    px-6 py-1
                `}
            >
                <button>
                    <Link
                        data-active={pathname === "/"}
                        href={`/`}
                        className={`
                                jelly jelly-increased flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                text-woodsmoke-400 data-[active=true]:text-main-600
                                selected:bg-woodsmoke-400 selected:text-gray-300
                                hover:text-main-400
                                transition-all duration-200 ease-in-out
                            `}
                    >
                        <Icon type="home" className="h-5" />
                    </Link>
                </button>
                <button>
                    <Link
                        data-active={pathname === "/search"}
                        href={`/search`}
                        className={`
                                jelly jelly-increased flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                text-woodsmoke-400 data-[active=true]:text-main-600
                                selected:bg-woodsmoke-400 selected:text-gray-300
                                hover:text-main-400
                                transition-all duration-200 ease-in-out
                            `}
                    >
                        <Icon type="search" className="h-5" />
                    </Link>
                </button>
                <button>
                    <Link
                        data-active={
                            pathname === "/profile/me" ||
                            pathname === `/profile${username}`
                        }
                        href={`/profile/me`}
                        className={`
                                jelly jelly-increased flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                text-woodsmoke-400 data-[active=true]:text-main-600
                                selected:bg-woodsmoke-400 selected:text-gray-300
                                hover:text-main-400
                                transition-all duration-200 ease-in-out
                            `}
                    >
                        {avatar_url ? (
                            <Avatar size={24} url={avatar_url} />
                        ) : (
                            <TbUserFilled className="size-6" />
                        )}
                        {/* <div className="text-12 font-600">Perfil</div> */}
                    </Link>
                </button>
            </nav>
        </div>
    );
}
