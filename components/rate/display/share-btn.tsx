import { Share } from "lucide-react";
import Link from "next/link";
import useScrollDirection from "@/hooks/useScrollDirection";
import Icon from "@/components/ui/Icon";

export default function ShareBtn({
    shorten,
}: {
    shorten: string;
}) {
    const scrollDirection = useScrollDirection();
    return (
        <Link
            href={`/r/${shorten}/share`}
            className={`
                    p-3
                    flex justify-center items-center
                    bg-orange-400 text-white font-bold rounded-full
                    fixed right-4
                    ${scrollDirection > "down" ? "bottom-20" : "bottom-4"}
                    md:bottom-4
                    transition-all duration-300
                `}
        >
            <Icon type="share" className="cursor-pointer size-6"/>
        </Link>
    );
}
