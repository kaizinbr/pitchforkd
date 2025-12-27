"use client";
import { User } from "@/lib/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FollowBtn({
    profile,
    isUser,
}: {
    profile: User;
    isUser: boolean;
}) {
    const [isFollowing, setIsFollowing] = useState(false);
    const checkIfFollowing = async () => {
        const response = await axios.get(
            `/api/user/${profile.username}/follow-check`
        );
        console.log("follow-check response:", response.data.isFollowing);

        if (!response.data!.isFollowing) {
            console.error(
                "Error checking follow status",
                response.data!.isFollowing
            );
        } else {
            setIsFollowing(response.data!.isFollowing);
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
                        if (isFollowing) {
                            const response = await axios.post(
                                `/api/user/${profile.username}/relation`,
                                { ACTION: "UNFOLLOW" }
                            );
                            if (response.data.error) {
                                console.error(
                                    "Error unfollowing user",
                                    response.data.error
                                );
                            } else {
                                setIsFollowing(false);
                            }
                        } else {
                            const response = await axios.post(
                                `/api/user/${profile.username}/relation`,
                                { ACTION: "FOLLOW" }
                            );
                            if (response.data.error) {
                                console.error(
                                    "Error following user",
                                    response.data.error
                                );
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
