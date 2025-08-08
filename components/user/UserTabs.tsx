"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserTabsProps {
    username: string;
}

export default function UserTabs({ username }: UserTabsProps) {
    const pathname = usePathname();
    const baseUrl = `/${username}`;
    
    const tabs = [
        { name: "Avaliações", href: baseUrl, key: "reviews" },
        { name: "Seguidores", href: `${baseUrl}/followers`, key: "followers" },
        { name: "Seguindo", href: `${baseUrl}/following`, key: "following" },
        { name: "Favoritos", href: `${baseUrl}/favorites`, key: "favorites" },
        // { name: "Sobre", href: `${baseUrl}/about`, key: "about" },
    ];

    const getActiveTab = () => {
        if (pathname === baseUrl) return "reviews";
        if (pathname.includes("/followers")) return "followers";
        if (pathname.includes("/following")) return "following";
        if (pathname.includes("/favorites")) return "favorites";
        if (pathname.includes("/about")) return "about";
        return "reviews";
    };

    const activeTab = getActiveTab();

    return (
        <div className="w-full max-w-2xl px-5 border-b border-bunker-700">
            <nav className="flex space-x-0">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    
                    return (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className={`
                                px-4 py-3 text-sm font-medium transition-colors duration-200
                                border-b-2 min-w-0 flex-1 text-center
                                ${isActive 
                                    ? 'border-main-500 text-main-500' 
                                    : 'border-transparent text-bunker-300 hover:text-white hover:border-bunker-500'
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