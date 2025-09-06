"use client";

import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Search({ placeholder }: { placeholder: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSyncing, setIsSyncing] = useState(true);

    // Sincroniza o valor do input apenas ao montar ou quando a rota muda externamente
    useEffect(() => {
        const match = typeof pathname === "string" ? pathname.match(/^\/search\/([^\/]+)/) : null;
        if (match) {
            setSearch(decodeURIComponent(match[1]));
            setIsSyncing(true);
        }
    }, [pathname]);

    // Mantém o foco no input após navegação ou atualização do valor
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [search]);

    // Debounce para navegação, preservando filtro
    useEffect(() => {
        if (isSyncing) {
            setIsSyncing(false);
            return;
        }
        const timeout = setTimeout(() => {
            if (search.trim() === "") {
                router.replace("/search");
                return;
            }
            // Preserva o filtro/aba
            const match = pathname.match(/^\/search\/[^\/]+(\/[^\/]+)?/);
            const filter = match && match[1] ? match[1] : "";
            router.replace(`/search/${encodeURIComponent(search.trim())}${filter}`);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <form
            onSubmit={e => e.preventDefault()}
            className="relative flex flex-1 flex-shrink-0 w-full h-7 px-4 max-w-2xl"
        >
            <label htmlFor="search" className="sr-only">
                Pesquisa
            </label>
            <input
                ref={inputRef}
                className={`
                        peer block w-full rounded-xl bg-shark-900 border border-shark-800
                        py-3 pl-12 !text-sm outline-2 placeholder:text-shark-300 outline-none
                    `}
                placeholder={placeholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <FaMagnifyingGlass className="absolute left-9 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-woodsmoke-500 peer-focus:text-woodsmoke-300" />
        </form>
    );
}