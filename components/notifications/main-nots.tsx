"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/components/ui/Avatar";
import { Notification } from "@/lib/utils/types";
import { Skeleton } from "@mantine/core";
import { getPastRelativeTime, displayPastRelativeTime } from "@/lib/utils/time";
import axios from "axios";

function NotificationCard({ notification }: { notification: Notification }) {
    const [saw, setSaw] = useState(notification.seen);
    const [album, setAlbum] = useState<any>();
    const supabase = createClient();

    async function editSeen(id: string) {
        console.log(id);
        const { data, error } = await supabase
            .from("notifications")
            .update({
                seen: true,
            })
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }
        setSaw(true);
    }

    useEffect(() => {
        const fetchAlbum = async (id: string) => {
            const response = await axios.get(`/api/spot/album/${id}`);
            setAlbum(response.data);
        };

        fetchAlbum(notification.ratings.album_id);
    }, []);

    return (
        <button
            className={`
                w-full
                p-4 rounded-xl shadow-md border border-bunker-800
                
                ${saw ? "bg-transparent text-bunker-400" : "bg-bunker-800 hover:bg-bunker-700"}
                transition-all duration-200 ease-in-out
            `}
            onClick={() => {
                editSeen(notification.id);
            }}
        >
            <div className="flex items-start text-start space-x-4">
                <Avatar
                    size={32}
                    src={notification.profiles.avatar_url}
                    className={"size-8"}
                    isIcon
                />
                <div className="w-[calc(100%-48px)]">
                    {album ? (
                        <p className="text-sm">
                            <Link
                                href={`/${notification.profiles.username}`}
                                className="font-semibold"
                            >
                                {notification.profiles.name ||
                                    notification.profiles.username}
                            </Link>{" "}
                            curtiu o seu review de{" "}
                            {album && (
                                <Link
                                    href={`/r/${notification.ratings.shorten}`}
                                    className="font-semibold"
                                >
                                    {album && album.name}
                                </Link>
                            )}{" "}
                            de{" "}
                            <span className="font-semibold">
                                {album && album.artists[0].name}
                            </span>
                        </p>
                    ) : (
                        <Skeleton height={8} radius="xl" />
                    )}
                    <span className="text-bunker-300 text-xs">
                       {displayPastRelativeTime(new Date(notification.created_at))}
                        
                    </span>
                </div>
            </div>
        </button>
    );
}

export default function NotsPage() {
    const supabase = createClient();
    const [notifications, setNotifications] = useState<Notification[] | any[]>(
        []
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                console.error("User not logged in");
                return;
            }

            const { data, error } = await supabase
                .from("notifications")
                .select(
                    `*,
                    profiles!notifications_sender_id_fkey(
                        *
                    ),
                    ratings(
                        *
                    )`
                )
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error);
                return;
            }

            console.log(data);

            setNotifications(data);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Notificações</h1>
            {loading ? (
                <div className="space-y-4 w-full">
                    <Skeleton height={64} className="!rounded-xl" />
                    <Skeleton height={64} className="!rounded-xl" />
                    <Skeleton height={64} className="!rounded-xl" />
                    <Skeleton height={64} className="!rounded-xl" />
                </div>
            ) : (
                <div className="space-y-4 w-full">
                    {notifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
