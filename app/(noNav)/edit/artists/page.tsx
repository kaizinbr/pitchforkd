import Edit from "@/components/user/edit/edit-page";
import EditArtists from "@/components/user/edit/artists/edit-artists-page";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
            {profile.artists ? (
                <EditArtists initialArtists={profile.artists} />
            ) : (
                <div>User not found</div>
            )}
        </div>
    );
}
