import AlbumPage from "@/components/album/AlbumPage";
import AlbumMain from "@/components/album/album-main";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Álbum | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    let profile = null;

    const session = await auth();

    console.log("Session:", session);

    if (!session || !session.user) {
        console.log("Usuário não autenticado");
    } else {
        profile = await prisma.profile.findUnique({
            where: {
                id: session?.user!.id,
            },
        });
    }

    return (
        <div className="flex flex-col gap-4 items-center relative">
            <AlbumMain album_id={id} profile={profile} />
        </div>
    );
}
