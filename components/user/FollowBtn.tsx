"use client";
import { User } from "@/lib/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { auth } from "@/auth";

import axios from "axios";

export default function FollowBtn({
    profile,
    isUser,
}: {
    profile: User;
    isUser: boolean;
}) {
    const [isFollowing, setIsFollowing] = useState(false);

    const supabase = createClient();

    // const  = supabase.auth.user();

    const checkIfFollowing = async () => {
        
        const response = await axios.get(`/api/user/${profile.username}/follow-check`);
        const { isFollowing: followingCheck } = response.data;
        console.log("follow-check response:", response.data);

        if (!followingCheck) {
            console.error("Error checking follow status", followingCheck);
        } else {
            setIsFollowing(followingCheck.length > 0);
        }
    };

    useEffect(() => {
        checkIfFollowing();
    }, [profile.id]);

    return (
        <>
            {isUser ? (
                <Link
                    className={`
                        mt-6
                px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                cursor-pointer
                border-2 ${
                    isFollowing
                        ? " text-neutral-300 hover:bg-neutral-700 border-main-500"
                        : "bg-main-500 text-white hover:bg-main-600 border-transparent"
                }
            
            `}
                    href={`/edit`}
                >
                    Editar perfil
                </Link>
            ) : (
                <button
                    className={`
                        mt-6
                px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                cursor-pointer
                border-2 ${
                    isFollowing
                        ? " text-neutral-300 hover:bg-neutral-700 border-main-500"
                        : "bg-main-500 text-white hover:bg-main-600 border-transparent"
                }            
            `}
                    onClick={async () => {
                        const {
                            data: { user: currentUser },
                        } = await supabase.auth.getUser();

                        console.log("Current User:", currentUser);
                        if (!currentUser) return;

                        if (isFollowing) {
                            const { error } = await supabase
                                .from("follows")
                                .delete()
                                .eq("follower_id", currentUser.id)
                                .eq("followed_id", profile.id);

                            if (error) {
                                console.error("Error unfollowing user", error);
                            } else {
                                setIsFollowing(false);
                            }
                        } else {
                            const { error } = await supabase
                                .from("follows")
                                .insert({
                                    followed_id: profile.id,
                                    follower_id: currentUser.id,
                                });

                            if (error) {
                                console.error("Error following user", error);
                            } else {
                                setIsFollowing(true);
                            }
                        }
                    }}
                >
                    {isFollowing ? "Seguindo" : `Seguir`}
                </button>
            )}
        </>
    );
}
