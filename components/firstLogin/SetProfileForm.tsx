"use client";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./AvatarEdit";
import { Textarea } from "@mantine/core";
import { useSearchParams, useRouter } from "next/navigation";
import containsSpecialChars from "@/lib/utils/containsSpecialChars";
import usernameAlreadyExists from "@/lib/utils/usernameAlreadyExists";

import classes from "./AcForm.module.css";
import Link from "next/link";

export default function SetProfileForm({ user }: { user: User | null }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [originalUsername, setOriginalUsername] = useState<string | null>(
        null
    );
    const [site, setsite] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const [bio, setBio] = useState<string | null>(null);
    const [pronouns, setPronouns] = useState<string | null>(null);

    const [message, setMessage] = useState<string | null>(null);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);

    const handleEditUsername = (e: ChangeEvent<HTMLInputElement>) => {
        if (containsSpecialChars(e.target.value)) {
            setMessage(
                "O nome de usuário não pode conter caracteres especiais"
            );
            setCanUpdate(false);
            return;
        }

        if (e.target.value.length > 15) {
            setMessage("O nome de usuário deve ter no máximo 15 caracteres");
            setCanUpdate(false);
            return;
        }

        usernameAlreadyExists({
            username: e.target.value,
            actualUsername: originalUsername as string,
        }).then((exists) => {
            console.log(exists);
            if (exists) {
                setMessage("Este nome de usuário já está em uso");
                setCanUpdate(false);
                return;
            }
            setMessage(null);
        });

        setUsername(e.target.value);
        setCanUpdate(true);
    };

    console.log(user);

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from("profiles")
                .select(`name, username, site, avatar_url, bio, pronouns`)
                .eq("id", user?.id)
                .single();

            if (error && status !== 406) {
                console.log(error);
                throw error;
            }

            if (data) {
                setName(data.name);
                setUsername(data.username);
                setOriginalUsername(data.username);
                setsite(data.site);
                setAvatarUrl(data.avatar_url);
                setBio(data.bio);
                setPronouns(data.pronouns);
            }
        } catch (error) {
            alert("Error loading user data!");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        getProfile();
    }, [user, getProfile]);

    const router = useRouter();

    async function updateProfile({
        username,
        site,
        avatar_url,
        name,
        bio,
        pronouns,
    }: {
        username: string | null;
        name: string | null;
        site: string | null;
        avatar_url: string | null;
        bio: string | null;
        pronouns: string | null;
    }) {
        try {
            setLoading(true);

            const lowercased_username = username?.toLowerCase();

            const { error } = await supabase
                .from("profiles")
                .update({
                    name: name,
                    username,
                    lowercased_username,
                    site,
                    avatar_url,
                    bio,
                    pronouns,
                })
                .eq("id", user?.id);
            if (error) throw error;
            alert("Profile updated!");
        } catch (error) {
            alert("Error updating the data!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className={`
                        flex-1 flex flex-col w-full justify-center gap-2 
                        text-foreground 
                        p-8 bg-neutral-700
                        border border-neutral-700 rounded-2xl overflow-hidden
                    `}
        >
            <div
                className={`
                            flex flex-col justify-start
                            w-full
                        `}
            >
                <div
                    className={`
                                bgPfp flex flex-col justify-end items-start relative
                                h-56 w-full
                            `}
                >
                    <div
                        className={`
                    
                                flex flex-row justify-start items-center
                                gap-3 pt-8 px-4 w-full h-56
                                bg-gradient-to- from-transparent to-black/45 from-40%
                                z-30
                            `}
                    >
                        <Avatar
                            uid={user?.id ?? null}
                            src={avatar_url}
                            size={176}
                            onUpload={(url) => {
                                setAvatarUrl(url);
                                updateProfile({
                                    name: name,
                                    username,
                                    site,
                                    avatar_url: url,
                                    pronouns,
                                    bio,
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
            <div
                className={`
                            profile  flex-col-reverse
                            flex items-center justify-center
                            col-span-6 lg:col-span-4
                            relative
                            w-full
                            mt-8
                            px-4
                        `}
            >
                <div
                    className={`
                    
                                    flex flex-col justify-center lg:items-center
                    
                                    bg-default-fill
                                    rounded-3xl w-full
                                    gap-3
                                `}
                >
                    <form
                        autoComplete="off"
                        spellCheck="false"
                        className="flex flex-col justify-start items-start w-full text-neutral-100"
                    >
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={name || ""}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu Nome..."
                                className={`
                                                 rounded-lg
                                                outline-none
                                                bg-neutral-700 w-full
                                                transition duration-200 ease-in-out
                                                text-3xl font-bold
                                            `}
                            ></input>
                        </div>
                        <div className="flex flex-row pt-1">
                            <span className="text-lg font-medium">@</span>
                            <input
                                type="text"
                                name="username"
                                value={username || ""}
                                onChange={(e) => handleEditUsername(e)}
                                placeholder="Seu Username..."
                                className={`
                                                rounded-lg
                                                outline-none
                                                bg-neutral-700 w-full
                                                transition duration-200 ease-in-out
                                                text-lg  font-medium
                                            `}
                            ></input>
                        </div>
                        <span className="text-xs pb-1 text-red-400">
                            {message ? message : ""}
                        </span>
                        <div>
                            <input
                                type="text"
                                name="site"
                                value={site || ""}
                                onChange={(e) => setsite(e.target.value)}
                                placeholder="Site"
                                className={`
                                                rounded-lg
                                                outline-none
                                                bg-neutral-700 w-full
                                                transition duration-200 ease-in-out
                                                text-lg  font-medium py-1
                                            `}
                            ></input>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="pronouns"
                                value={pronouns || ""}
                                onChange={(e) => setPronouns(e.target.value)}
                                placeholder="Pronomes"
                                className={`
                                                rounded-lg
                                                outline-none
                                                bg-neutral-700 w-full
                                                transition duration-200 ease-in-out
                                                text-lg  font-medium py-1
                                            `}
                            ></input>
                        </div>
                        <div
                            className={`
                    
                                        text-lg
                                       bg-neutral-700 w-full
                                    `}
                        >
                            <Textarea
                                label=""
                                placeholder="Sua bio"
                                autosize
                                variant="unstyled"
                                minRows={2}
                                maxRows={4}
                                value={bio || ""}
                                classNames={{
                                    root: "w-full",
                                    input: classes.textareaInput,
                                }}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>
                    </form>
                    {/* </div> */}
                </div>
            </div>
            <div className="flex w-full flex-row gap-4">
                <button
                    className="bg-neutral-200 rounded-lg px-4 py-2 text-neutral-800 font-bold"
                    onClick={() =>
                        updateProfile({
                            name: name,
                            username,
                            site,
                            avatar_url,
                            pronouns,
                            bio,
                        })
                    }
                    disabled={loading || message !== null || !canUpdate}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
                <Link
                    href="/"
                    className="bg-neutral-200 rounded-lg px-4 py-2 text-neutral-800 font-bold"
                >
                    Continuar
                </Link>
            </div>
        </div>
    );
}
