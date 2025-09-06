"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SearchTabsProps {
    query: string;
}

export default function SearchTabs({ query }: SearchTabsProps) {
    const pathname = usePathname();
    const baseUrl = `/search/${query}`;

    const tabs = [
        { name: "Álbuns", href: baseUrl, key: "albums" },
        // { name: "Álbuns", href: `${baseUrl}/albums`, key: "albums" },
        { name: "Músicas", href: `${baseUrl}/tracks`, key: "tracks" },
        { name: "Artistas", href: `${baseUrl}/artists`, key: "artists" },
        { name: "Perfis", href: `${baseUrl}/profiles`, key: "profiles" },
        // { name: "Sobre", href: `${baseUrl}/about`, key: "about" },
    ];

    const getActiveTab = () => {
        if (pathname === baseUrl) return "albums";
        // if (pathname.includes("/albums")) return "albums";
        if (pathname.includes("/tracks")) return "tracks";
        if (pathname.includes("/artists")) return "artists";
        if (pathname.includes("/profiles")) return "profiles";
        return "albums";
    };

    const activeTab = getActiveTab();

    return (
        <div className="w-full max-w-2xl overflow-hidden">
            <nav
                className="flex px-4 gap-2  overflow-x-auto no-scrollbar touch-pan-x"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className={`
                                px-4 py-[7px] text-sm font-medium transition-colors duration-200
                                flex-1 text-center max-w-fit
                                rounded-full
                                ${isActive 
                                    ? 'bg-main-500' 
                                    : 'bg-shark-800 text-shark-300'
                                }
                            `}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}