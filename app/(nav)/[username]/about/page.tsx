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

    if (!profile?.favorites || !profile.favorites == null) {
        console.log("No favorites found for this profile");
    }


    console.log("UserLayout profile:", profile?.artists);

    // Buscar usuário autenticado
    const currentUser = await auth();

    return (
        <div className="w-full px-4 pt-4 flex flex-col items-center justify-center">
            {profile?.bio && (
                <div className="w-full mb-2">
                    <h2 className=" text-sm text-gray-300">Sobre mim</h2>
                    <p className=" text-sm mt-2">{profile.bio}</p>
                </div>
            )}
            {profile?.createdAt && (
                <div className="w-full mb-4">
                    <p className=" text-sm text-gray-300">Membro desde {new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
            )}

             {Array.isArray(profile?.albuns) && profile.albuns.length > 0 ? (
                <div className="w-full">
                    <h2 className=" text-sm text-gray-300">Álbuns favoritos</h2>
                    <div className="divide-y divide-gray-700 mt-4">
                        {Array.isArray(profile?.albuns) && profile.albuns.map((album: any) => (
                            <div
                                key={album.id}
                                className="flex items-center space-x-4 py-2 "
                            >
                                <Image
                                    src={album.src}
                                    alt={album.title}
                                    className="w-12 h-12 object-cover rounded"
                                    width={48}
                                    height={48}
                                />
                                <div>
                                    <h3 className="text-md text-white line-clamp-1">
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
                null
            )}
            
            {Array.isArray(profile?.artists) && profile.artists.length > 0 ? (
                <div className="w-full mt-8">
                    <h2 className=" text-sm text-gray-300">Artistas favoritos</h2>
                    <div className="divide-y divide-gray-700 mt-4">
                        {Array.isArray(profile?.artists) && profile.artists.map((artist: any) => (
                            <div
                                key={artist.id}
                                className="flex items-center space-x-4 py-2 "
                            >
                                <Image
                                    src={artist.src}
                                    alt={artist.name}
                                    className="size-12 object-cover rounded-full"
                                    width={48}
                                    height={48}
                                />
                                <div>
                                    <h3 className="text-md text-white">
                                        {artist.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                null
            )}

        </div>
    );
}
