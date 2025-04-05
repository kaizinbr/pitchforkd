"use client";

// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
        console.log(`Searching... ${term}`);

        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex flex-1 flex-shrink-0 w-full h-7">
            <label htmlFor="search" className="sr-only">
                Pesquisa
            </label>
            <input
                className={`
                        peer block w-full rounded-xl bg-bunker-700 border border-bunker-700
                        py-[9px] pl-12 text-sm outline-2 placeholder:text-bunker-500 outline-none
                    `}
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get("query")?.toString()}
            />
            <FaMagnifyingGlass className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-woodsmoke-500 peer-focus:text-woodsmoke-300" />
        </div>
    );
}
