"use client";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import Avatar from "./avatar";
import usernameAlreadyExists from "@/lib/utils/usernameAlreadyExists";
import containsSpecialChars from "@/lib/utils/containsSpecialChars";
import { useRouter } from "next/navigation";

import classes from "./AcForm.module.css";

export default function AccountForm({ profile }: { profile: any }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [name, setName] = useState<string | null>(profile.name);
    const [username, setUsername] = useState<string | null>(profile.username);
    const [actualUsername, setActualUsername] = useState<string | null>(
        profile.username
    );
    const [site, setSite] = useState<string | null>(profile.site);
    const [avatar_url, setAvatarUrl] = useState<string | null>(
        profile.avatar_url
    );
    const [pronouns, setPronouns] = useState<string | null>(profile.pronouns);
    const [message, setMessage] = useState<string>("");

    const router = useRouter();
    async function updateProfile({
        username,
        site,
        avatar_url,
        name,
        pronouns,
    }: {
        username: string | null;
        name: string | null;
        site: string | null;
        avatar_url: string | null;
        pronouns: string | null;
    }) {
        try {
            setLoading(true);

            const lowercasedUsername = username?.toLowerCase();

            const { error } = await supabase.from("profiles").upsert({
                id: profile?.id as string,
                name,
                username,
                lowercased_username: lowercasedUsername,
                site,
                avatar_url,
                pronouns,
            });
            if (error) throw error;
            alert("Profile updated!");
            router.push(`/${username}`);
        } catch (error) {
            alert("Error updating the data!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-widget flex flex-col justify-center w-full max-w-md  pt-16 px-8 md:px-0 md:pl-16">
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
                            uid={profile?.id ?? null}
                            url={avatar_url}
                            size={192}
                            username={username}
                            onUpload={(url) => {
                                setAvatarUrl(url);
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
                        className="flex flex-col justify-start items-start w-full"
                    >
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={name || ""}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu Nome..."
                                maxLength={20}
                                className={`
                                         rounded-lg
                                        outline-none
                                        bg-transparent w-full
                                        transition duration-200 ease-in-out
                                        text-3xl font-bold 
                                    `}
                            ></input>
                        </div>
                        <div
                            className={`
                                flex flex-row py-1
                                ${message != "" ? "text-red-500" : ""}
                                transition duration-200 ease-in-out
                            `}
                        >
                            <span className="text-lg font-medium">@</span>
                            <input
                                type="text"
                                name="username"
                                value={username || ""}
                                onKeyUp={async (e) => {
                                    if (e.currentTarget.value.trim() === "") {
                                        setDisabled(true);
                                        setMessage(
                                            "Username não pode ser vazio"
                                        );
                                    } else if (
                                        await usernameAlreadyExists({
                                            username: e.currentTarget.value,
                                            actualUsername:
                                                actualUsername ?? "",
                                        })
                                    ) {
                                        console.log("user already exists");
                                        setDisabled(true);
                                        setMessage("Username já existe");
                                    } else if (
                                        containsSpecialChars(
                                            (e.target as HTMLInputElement).value
                                        )
                                    ) {
                                        setDisabled(true);
                                        setMessage(
                                            "Username não pode conter caracteres especiais"
                                        );
                                    } else if (
                                        (e.target as HTMLInputElement).value
                                            .length > 20
                                    ) {
                                        setDisabled(true);
                                        console.log("user too long");
                                        setMessage(
                                            "O nome de usuário deve ter no máximo 20 caracteres"
                                        );
                                    } else {
                                        setDisabled(false);
                                        setMessage("");
                                    }
                                }}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Seu Username..."
                                maxLength={20}
                                className={`
                                        rounded-lg
                                        outline-none
                                        bg-transparent w-full
                                        transition duration-200 ease-in-out
                                        text-lg  font-medium
                                    `}
                            ></input>
                        </div>
                        {message != "" ? (
                            <span className="text-red-500 text-sm">
                                {message}
                            </span>
                        ) : null}
                        <div>
                            <input
                                type="text"
                                name="site"
                                value={site || ""}
                                onChange={(e) => setSite(e.target.value)}
                                placeholder="Site"
                                maxLength={20}
                                className={`
                                        rounded-lg
                                        outline-none
                                        bg-transparent w-full
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
                                maxLength={15}
                                className={`
                                        rounded-lg
                                        outline-none
                                        bg-transparent w-full
                                        transition duration-200 ease-in-out
                                        text-lg  font-medium py-1
                                    `}
                            ></input>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex w-full flex-row gap-4 mt-8">
                <button
                    className={`
                            w-full px-4 py-2 rounded-xl !font-semibold text-neutral-100
                            transition duration-200 ease-in-out
                            ${disabled ? "bg-gray-400 cursor-not-allowed" : " bg-green-pastel hover:bg-main-600 cursor-pointer"}
                        `}
                    onClick={() =>
                        updateProfile({
                            name,
                            username,
                            site,
                            avatar_url,
                            pronouns,
                        })
                    }
                    disabled={disabled}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </div>
    );
}
