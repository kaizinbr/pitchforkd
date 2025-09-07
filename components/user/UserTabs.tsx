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
        { name: "Sobre", href: `${baseUrl}/about`, key: "about" },
        { name: "Seguindo", href: `${baseUrl}/following`, key: "following" },
        { name: "Seguidores", href: `${baseUrl}/followers`, key: "followers" },
        // { name: "Mural", href: `${baseUrl}/mural`, key: "mural" },
    ];

    const getActiveTab = () => {
        if (pathname === baseUrl) return "reviews";
        if (pathname.includes("/followers")) return "followers";
        if (pathname.includes("/following")) return "following";
        // if (pathname.includes("/mural")) return "mural";
        if (pathname.includes("/about")) return "about";
        return "reviews";
    };

    const activeTab = getActiveTab();

    return (
        <div className="w-full max-w-2xl border-b border-shark-700 mt-6">
            <nav className="flex px-4 overflow-x-auto no-scrollbar touch-pan-x">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    
                    return (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            className={`
                                p py-3 pb-5 text-sm font-medium transition-colors duration-200
                                border-b-2  flex-1 text-center
                                ${isActive 
                                    ? 'border-main-500 text-main-500' 
                                    : 'border-transparent text-shark-300 hover:text-white hover:border-shark-500'
                                }
                            `}
                        >
                            <span className={`
                                px-4 py-2 text-sm font-medium transition-colors duration-200
                                border  flex-1 text-center rounded-xl
                                ${isActive 
                                    ? 'bg-main-500 text-shark-100 border-main-500' 
                                    : 'border-transparent text-shark-300 hover:text-white hover:border-shark-500'
                                }
                            `}>{tab.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}