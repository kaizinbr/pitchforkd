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
            className={`flex flex-row w- items-center bg-woodsmoke-800 rounded-3xl p-4 mx-3 ${className}`}
        >
            <div className="size-12 rounded-full bg-woodsmoke-300 mr-3">
                <Avatar
                    size={50}
                    src={data.avatar_url}
                    className={"size-12"}
                />
            </div>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                    <h3 className="font-bold text-base">{data.name}</h3>
                    <div className="text-sm text-woodsmoke-300">
                        @{data.username}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-xs text-woodsmoke-300">
                        {/* Membro desde {getPastRelativeTime(data.created_at, today)} */}
                    </div>
                </div>
            </div>
        </Link>
    );
}