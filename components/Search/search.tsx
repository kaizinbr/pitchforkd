"use client";
import Search from "@/components/Search/search-bar";
import useScrollDirection from "@/hooks/useScrollDirection";
import SearchTabs from "@/components/Search/SearchTabs";

export default function SearchLayout({
    query,
    tab,
}: {
    query: string;
    tab: string;
}) {
    const scrollDirection = useScrollDirection();
    return (
        <div
            className={`
                    w-full flex-col gap-4 fixed top-0 left-0 right-0 
                    z-10
                    backdrop-blur-xl
                    bg-shark-950/70 
                    py-5 flex
                    items-center mx-auto
                    md:mt-16
                    transition-all duration-300
                    ${scrollDirection === "down" ? "-translate-y-34 md:-translate-y-16" : "translate-y-0"}
                `}
        >
            <Search placeholder="Pesquisar..." query={query} tab={tab}/>
            <SearchTabs query={query} />
        </div>
    );
}
