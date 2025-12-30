import Image from "next/image";
import UserCard from "@/components/ui/UserCard";
import { Profile } from "@/lib/utils/types";

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

export default async function UserList({
    users,
}: {
    users: Profile[] | any;
}) {
    return (
        <div className="flex flex-col gap-2 px-4 w-full mx-auto max-w-2xl">
            {users.map((user: any) => {
                return <UserCard key={user.id} data={user} />;
            })}
        </div>
    );
}
