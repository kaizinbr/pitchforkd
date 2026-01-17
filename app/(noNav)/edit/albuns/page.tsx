import EditAlbuns from "@/components/user/edit/albuns/edit-albuns-page";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const metadata = {
    title: "Editar perfil | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Page() {
    const session = await auth();

    if (!session?.user) {
        console.error("User is not authenticated");
        return <div>User is not authenticated</div>;
    }

    const profile = await prisma.profile.findFirst({
        where: { id: session.user.id },
    }); 

    if (!profile) {
        console.error("Error fetching user");
        return <div>Error fetching user</div>;
    }

    return (
        <div className="flex flex-col gap-4 items-center relative w-full pb-8">
            {profile.albuns ? (
                <EditAlbuns initialAlbuns={profile.albuns} />
            ) : (
                <div>User not found</div>
            )}
        </div>
    );
}
