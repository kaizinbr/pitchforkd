import Image from "next/image";
import UserCard from "@/components/ui/UserCard";

export default async function FollowersList({
    initialFollowers,
}: {
    initialFollowers: { id: string; username: string; avatar_url: string; verified: boolean }[];
}) {
    // Implement the FollowersList component logic here
    // This is a placeholder for the actual implementation
    return (
        <div className="flex flex-col gap-2 px-4">
            {/* Render followers list */}
            {initialFollowers.map((follower) => (
                <UserCard key={follower.id} data={follower} />
            ))}
        </div>
    );
}