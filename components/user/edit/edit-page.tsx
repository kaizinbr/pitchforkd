"use client";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Avatar from "./editable-avatar";
import usernameAlreadyExists from "@/lib/utils/usernameAlreadyExists";
import containsSpecialChars from "@/lib/utils/containsSpecialChars";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Edit({ profile }: { profile: any }) {
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

    const album = profile.favorites[0].albuns;
    const artists = profile.favorites[0].artists;

    return (
        <div className="form-widget flex flex-col justify-center w-full px-5 max-w-2xl pt-16 md:px-0 relative">
            {/* FOTO DE PERFIL */}
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
            {/* FORMULARIO DE DADOS DE USUARIO */}
            <form
                className={`
                    profile  
                    flex-1 flex flex-col w-full
                    rounded-2xl p-5 bg-bunker-800
                    gap-3 mt-8
                `}
                autoComplete="off"
                spellCheck="false"
            >
                <h1 className="text-lg font-semibold">Dados pessoais</h1>
                <div>
                    <label
                        htmlFor="name"
                        className={`
                                    text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                                    text-bunker-300
                                `}
                    >
                        Nome
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={name || ""}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu Nome..."
                        maxLength={20}
                        className={`
                                        outline-none
                                        transition duration-200 ease-in-out
                                        text-3xl font-bold 
                                        flex h-10 w-full rounded-xl 
                                        border border-bunker-700 bg-bunker-700 px-3 py-2 
                                        ring-offset-background 
                                        placeholder:text-neutral-400 focus-visible:outline-none 
                                `}
                    ></input>
                </div>
                <div className="">
                    <label
                        htmlFor="username"
                        className={`
                                    text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                                    text-bunker-300
                                `}
                    >
                        Nome de usuário
                    </label>
                    <div
                        className={`
                                    flex flex-row py-1
                                    ${message != "" ? "text-red-500" : ""}
                                    transition duration-200 ease-in-out
                                    flex h-10 w-full rounded-xl
                                            border border-bunker-700 bg-bunker-700 px-3 py-2
                                            ring-offset-background
                                            placeholder:text-neutral-400 focus-visible:outline-none
                                `}
                    >
                        <span className="">@</span>
                        <input
                            type="text"
                            name="username"
                            value={username || ""}
                            onKeyUp={async (e) => {
                                if (e.currentTarget.value.trim() === "") {
                                    setDisabled(true);
                                    setMessage("Username não pode ser vazio");
                                } else if (e.currentTarget.value.length < 3) {
                                    setDisabled(true);
                                    setMessage(
                                        "Username deve ter pelo menos 3 caracteres"
                                    );
                                } else if (
                                    await usernameAlreadyExists({
                                        username: e.currentTarget.value,
                                        actualUsername: actualUsername ?? "",
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
                                            outline-none
                                            transition duration-200 ease-in-out
                                            ring-offset-background
                                            placeholder:text-neutral-400 focus-visible:outline-none w-full
                                        `}
                        ></input>
                    </div>
                </div>
                {message != "" ? (
                    <span className="text-red-500 text-sm">{message}</span>
                ) : null}
                <div>
                    <label
                        htmlFor="site"
                        className={`
                                    text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                                    text-bunker-300
                                `}
                    >
                        Website
                    </label>
                    <input
                        type="text"
                        name="site"
                        value={site || ""}
                        onChange={(e) => setSite(e.target.value)}
                        placeholder="Site"
                        maxLength={20}
                        className={`
                                        outline-none
                                        transition duration-200 ease-in-out
                                        text-3xl font-bold 
                                        flex h-10 w-full rounded-xl 
                                        border border-bunker-700 bg-bunker-700 px-3 py-2 
                                        ring-offset-background 
                                        placeholder:text-neutral-400 focus-visible:outline-none 
                                    `}
                    ></input>
                </div>

                <div>
                    <label
                        htmlFor="pronouns"
                        className={`
                                    text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                                    text-bunker-300
                                `}
                    >
                        Pronomes
                    </label>
                    <input
                        type="text"
                        name="pronouns"
                        value={pronouns || ""}
                        onChange={(e) => setPronouns(e.target.value)}
                        placeholder="Pronomes"
                        maxLength={15}
                        className={`
                                        outline-none
                                        transition duration-200 ease-in-out
                                        text-3xl font-bold 
                                        flex h-10 w-full rounded-xl 
                                        border border-bunker-700 bg-bunker-700 px-3 py-2 
                                        ring-offset-background 
                                        placeholder:text-neutral-400 focus-visible:outline-none 
                                    `}
                    ></input>
                </div>
            </form>
            {/* FAVORITOS */}
            <div className="flex flex-col w-full gap-3 mt-8">
                <h1 className="text-lg font-semibold">Favoritos</h1>
                <Link href={"/edit/albuns"} className="flex flex-col gap-2 rounded-2xl p-5 bg-bunker-800">
                    <h3 className="text-sm">Editar álbums</h3>
                    <>
                        {album.length > 0 ? (
                            <div className="w-full overflow-clip">
                                <div className="embla__container">
                                    {album.map((item: any, index: any) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center size-18 embla__slide__fav"
                                        >
                                            <Image
                                                src={item.src}
                                                alt={item.title}
                                                width={80}
                                                height={80}
                                                className="size-18 object-cover rounded-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full min-h-18">
                                <span className="text-bunker-300 text-sm">
                                    Nada por aqui ainda...
                                </span>
                            </div>
                        )}
                    </>
                </Link>
                <Link href={"/edit/artists"} className="flex flex-col gap-2 rounded-2xl p-5 bg-bunker-800">
                    <h3 className="text-sm">Editar artistas</h3>
                    <>
                        {artists.length > 0 ? (
                            <div className="w-full overflow-clip">
                                <div className="embla__container">
                                    {artists.map((item: any, index: any) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center size-18 embla__slide__fav"
                                        >
                                            <Image
                                                src={item.src}
                                                alt={item.title}
                                                width={80}
                                                height={80}
                                                className="size-18 object-cover rounded-full"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full min-h-18">
                                <span className="text-bunker-300 text-sm">
                                    Nada por aqui ainda...
                                </span>
                            </div>
                        )}
                        </>
                </Link>
            </div>

            <button
                className={`
                            py-2 px-6
                            flex justify-center items-center
                            text-white text-sm !font-semibold rounded-xl
                            fixed right-4
                            max-w-2xl mx-auto top-4
                            cursor-pointer
                            transition-all duration-300
                            z-[500]
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
    );
}
