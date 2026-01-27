import { SignOut } from "@/components/ui/sign-out-btn";
import { HeartCrack, CirclePause, BadgeQuestionMark , Fingerprint, Mail, ShieldEllipsis } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Configurações | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Index() {
    return (
        <div className="w-full max-w-2xl md:mt-20 mt-8 px-3 mx-auto">
            <div className="flex-1 w-full flex flex-col mb-10">
                <h3 className="text-gray-300 text-sm ml-2 mb-2">Conta</h3>
                <div className="w-full flex flex-col bg-shark-900 rounded-xl overflow-hidden mb-4">
                    <Link
                        href="/account"
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    bg-transparent hover:bg-shark-800 cursor-pointer
                                    transition duration-200
                                `}
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                    py-3 border-b border-shark-800
                                `}>
                            <Fingerprint size={16} />
                            <span className="">Informações de conta</span>
                        </div>
                    </Link>
                    <Link
                        href="/account/password"
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    bg-transparent hover:bg-shark-800 cursor-pointer
                                    transition duration-200
                                `}
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                    py-3 border-b border-shark-800
                                `}>
                            <ShieldEllipsis size={16} />
                            <span className="">Alterar senha</span>
                        </div>
                    </Link>
                    <Link
                        href="/account/email"
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    bg-transparent hover:bg-shark-800 cursor-pointer
                                    transition duration-200
                                `}
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                    py-3 border-b border-shark-800
                                `}>
                            <Mail size={16} />
                            <span className="">Alterar e-mail</span>
                        </div>
                    </Link>
                    <Link
                        href="/about"
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    bg-transparent hover:bg-shark-800 cursor-pointer
                                    transition duration-200
                                `}
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                    py-3 border-b border-shark-800
                                `}>
                            <BadgeQuestionMark  size={16} />
                            <span className="">Ajuda</span>
                        </div>
                    </Link>
                </div>
                
                <h3 className="text-gray-300 text-sm ml-2 mb-2">Zona perigosa</h3>
                <div className="w-full flex flex-col bg-shark-900 rounded-xl overflow-hidden">
                    <p
                        // href="/account"
                        aria-disabled="true"
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    bg-transparent cursor-not-allowed
                                    transition duration-200 opacity-50
                                `}
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                    py-3 border-b border-shark-800
                                `}>
                            <CirclePause size={16} />
                            <span className="">Desativar conta</span>
                        </div>
                    </p>
                    <Link
                        href="/account/delete"
                        className={`
                                    w-full gap-2 flex flex-row px-4
                                    bg-transparent hover:bg-shark-800 cursor-pointer
                                    transition duration-200
                                `}
                    >
                        <div className={`
                                    w-full gap-2 flex flex-row items-center
                                    py-3 border-b border-shark-800
                                `}>
                            <HeartCrack size={16} />
                            <span className="">Excluir conta</span>
                        </div>
                    </Link>
                    <SignOut />
                </div>
            </div>
        </div>
    );
}
