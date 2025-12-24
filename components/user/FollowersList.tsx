import Image from "next/image";
import UserCard from "@/components/ui/UserCard";

type FollowRelation = {
    followedId: string;
    followed: {
        id: string | null;
        name: string | null;
        username: string | null;
        avatarUrl: string | null;
        verified: boolean;
    };
};

type FollowerRelation = {
    followerId: string;
    follower: {
        id: string | null;
        name: string | null;
        username: string | null;
        avatarUrl: string | null;
        verified: boolean;
    };
};

export default async function FollowList({
    follows,
}: {
    follows: FollowRelation[] | FollowerRelation[];
}) {
    return (
        <div className="flex flex-col gap-2 px-4">
            {follows.map((item) => {
                const user = "followed" in item ? item.followed : item.follower;
                return <UserCard key={user.id} data={user} />;
            })}
        </div>
    );
}
