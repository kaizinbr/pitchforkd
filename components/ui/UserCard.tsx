import Avatar from "@/components/ui/Avatar";
import Link from "next/link";

export default function UserCard({
    data,
    className,
}: {
    data: any;
    className?: string;
}) {
    // console.log(data);
    return (
        <Link
            href={`/${data.username}`}
            className={`
                flex flex-row w- items-center ${className}
                p-2 rounded-lg hover:bg-neutral-800 bg-transparent transition-all duration-300
            `}
        >
            <div className="size-12 rounded-full bg-woodsmoke-300 mr-3">
                <Avatar
                    size={48}
                    src={data.avatar_url}
                    className={"size-12"}
                    isIcon
                />
            </div>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                    <h3 className="font-bold text-base">{data.name}</h3>
                    <div className="text-sm text-neutral-300">
                        @{data.username}
                    </div>
                </div>
            </div>
        </Link>
    );
}