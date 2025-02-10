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
                .select(`name, username, avatar_url`)
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
                        data-active={pathname === "/home"}
                        href={`/home`}
                        className={`
                                flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                data-[active=true]:text-orange-400
                                hover:text-orange-400
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
                                flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                data-[active=true]:text-orange-400
                                hover:text-orange-400
                                transition-all duration-200 ease-in-out
                            `}
                    >
                        <Icon type="search" className="h-5" />
                    </Link>
                </button>
                <button>
                    <Link
                        data-active={
                            pathname === "/me" ||
                            pathname === `${username}`
                        }
                        href={ username ? `/${username}` : "/me" }
                        className={`
                                flex min-w-[70px] basis-0 cursor-pointer
                                flex-col items-center gap-1 rounded-8 p-3
                                data-[active=true]:text-orange-400
                                hover:text-orange-400
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
