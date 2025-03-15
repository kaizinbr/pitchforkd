"use client";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
// import Avatar from "@/components/user/edit/editable-avatar";
import usernameAlreadyExists from "@/lib/utils/usernameAlreadyExists";
import containsSpecialChars from "@/lib/utils/containsSpecialChars";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Avatar from "@/components/ui/Avatar";
import EditPfp from "@/components/user/edit/edit-pfp";

export default function TestEdit({ profile }: { profile: any }) {
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
            <EditPfp avatar_url={avatar_url!} setAvatarUrl={setAvatarUrl} />
            
            {/* FORMULARIO DE DADOS DE USUARIO */}
            
        </div>
    );
}
