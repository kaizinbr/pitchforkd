import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function FavoritesPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;

    const profile = await prisma.profile.findFirst({
        where: { lowername: username.toLowerCase() },
    });

    if (!profile) {
        console.log("Profile not found");
    }

    if (!profile?.favorites) {
        console.log("No favorites found for this profile");
    }


    // console.log("UserLayout profile:", profile?.favorites[0].albuns);

    // Buscar usuário autenticado
    const currentUser = await auth();

    return (
        <div className="w-full px-4 pt-4 flex items-center justify-center">
            {profile?.favorites ? (
                <div className="w-full">
                    <h2 className=" text-sm text-gray-300">Álbuns favoritos</h2>
                    <div className="">
                        {Array.isArray(profile?.favorites) && profile.favorites.length > 0 && profile.favorites[0]?.albuns.map((album: any) => (
                            <div
                                key={album.id}
                                className="flex items-center space-x-4 py-2 border-b border-gray-700"
                            >
                                <Image
                                    src={album.src}
                                    alt={album.title}
                                    className="w-12 h-12 object-cover rounded"
                                    width={48}
                                    height={48}
                                />
                                <div>
                                    <h3 className="text-md text-white">
                                        {album.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {album.artist}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <h2 className=" text-sm text-gray-300">
                        Nenhum álbum favorito
                    </h2>
                </div>
            )}
            {/* <Favorites /> */}
        </div>
    );
}
