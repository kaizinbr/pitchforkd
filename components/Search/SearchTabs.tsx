"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchTabsProps {
    query: string;
}

export default function SearchTabs({ query }: SearchTabsProps) {
    const pathname = usePathname();
    const baseUrl = `/search?q=${query}`;
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const tabs = [
        { name: "Álbuns", href: `${baseUrl}&tab=albums`, key: "albums" },
        { name: "Músicas", href: `${baseUrl}&tab=tracks`, key: "tracks" },
        { name: "Artistas", href: `${baseUrl}&tab=artists`, key: "artists" },
        { name: "Perfis", href: `${baseUrl}&tab=profiles`, key: "profiles" },
        // { name: "Sobre", href: `${baseUrl}/about`, key: "about" },
    ];

    const getActiveTab = () => {
        if (pathname === baseUrl) return "albums";
        if (searchParams.get("tab") === "albums") return "albums";
        if (searchParams.get("tab") === "tracks") return "tracks";
        if (searchParams.get("tab") === "artists") return "artists";
        if (searchParams.get("tab") === "profiles") return "profiles";
        return "albums";
    };

    const activeTab = getActiveTab();

    return (
        <div className={`
            w-full max-w-2xl overflow-hidden 
            ${pathname === '/explore' ? 'hidden' : ''}
        `}>
            <nav
                className="flex px-4 gap-2  overflow-x-auto no-scrollbar touch-pan-x"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => {
                                if (tab.key === activeTab) return;
                                replace(tab.href);
                            }}
                            className={`
                                px-4 py-[7px] !text-sm !font-medium transition-colors duration-200
                                flex-1 text-center max-w-fit
                                rounded-full
                                ${isActive 
                                    ? 'bg-main-500' 
                                    : 'bg-shark-800 text-shark-300'
                                }
                            `}
                        >
                            {tab.name}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}