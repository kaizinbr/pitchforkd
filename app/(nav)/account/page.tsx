import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export default async function AccountPage() {
    const session = await auth();

    if (!session?.user) {
        return <div>Usuário não autenticado.</div>;
    }

    const profile = await prisma.profile.findUnique({
        where: { id: session?.user?.id },
    });

    const userData = await prisma.user.findUnique({
        where: { id: session?.user?.id },
    });

    return (
        <div className="w-full max-w-2xl md:mt-20 mt-8 px-3 mx-auto">
            <div className="flex-1 w-full flex flex-col mb-10">
                <h3 className="text-gray-300 text-sm ml-2 mb-2">Informações de conta</h3>
                <div className="w-full flex flex-col bg-shark-900 rounded-xl overflow-hidden">
                    <div
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    py-3 border-b border-shark-800
                                `}  
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                `}>
                            <span className="text-gray-400 text-sm">Nome de usuário:</span>
                            <span className="text-gray-200 text-sm font-medium">{profile?.username}</span>
                        </div>
                    </div>  
                    <div
                        className={`
                                    w-full gap-2 flex flex-row px-4 
                                    py-3 border-b border-shark-800
                                `}
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                `}>
                            <span className="text-gray-400 text-sm">E-mail:</span>
                            <span className="text-gray-200 text-sm font-medium">{userData?.email}</span>
                        </div>
                    </div>


                    <div
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    py-3 border-b border-shark-800
                                `}  
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                `}>
                            <span className="text-gray-400 text-sm">E-mail verificado:</span>
                            <span className="text-gray-200 text-sm font-medium">{userData?.emailVerified ? userData.emailVerified.toLocaleDateString() : "Não"}</span>
                        </div>
                    </div>  

                    <div
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    py-3 border-b border-shark-800
                                `}  
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                `}>
                            <span className="text-gray-400 text-sm">Senha cadastrada:</span>
                            <span className="text-gray-200 text-sm font-medium">{userData?.encryptedPassword ? "Sim" : "Não"}</span>
                        </div>
                    </div>  

                    <div
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    py-3 border-b border-shark-800
                                `}  
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                `}>
                            <span className="text-gray-400 text-sm">ID:</span>
                            <span className="text-gray-200 text-sm font-medium">{userData?.id}</span>
                        </div>
                    </div>  


                    <div
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    py-3 border-b border-shark-800
                                `}  
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                `}>
                            <span className="text-gray-400 text-sm">Entrou em:</span>
                            <span className="text-gray-200 text-sm font-medium">{userData?.createdAt.toLocaleDateString()}</span>
                        </div>
                    </div>  


                </div>
            </div>
        </div>
    );
}