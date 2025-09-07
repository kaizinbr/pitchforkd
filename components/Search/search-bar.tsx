"use client";

// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useRef, useEffect } from "react";

export default function SearchBar({
    placeholder,
    query,
    tab,
}: {
    placeholder: string;
    query: string;
    tab: string;
}) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchInputChange = (value: string) => {
        setSearchTerm(value);
        handleSearch(value);
    };

    useEffect(() => {
        if (pathname === '/explore') {
            return
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchTerm]);

    const handleSearch = useDebouncedCallback((term: string) => {
        console.log(`Searching... ${term}`);
        if (term === query) return;
        if (term.trim() === "") {
            replace("/explore");
        }

        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set("query", term);
            replace(`/search?q=${encodeURIComponent(term.trim())}&tab=${tab}`);
        } else {
            params.delete("query");
            replace("/explore");
        }
    }, 300);

    return (
        <div className="relative flex flex-1 flex-shrink-0 w-full h-7 px-4 max-w-2xl">
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
                onChange={(e) => {
                    handleSearchInputChange(e.target.value);
                }}
                defaultValue={decodeURIComponent(query)}
            />
            <FaMagnifyingGlass className="absolute left-9 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-woodsmoke-500 peer-focus:text-woodsmoke-300" />
        </div>
    );
}
