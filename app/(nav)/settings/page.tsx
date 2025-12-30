import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Trash, LockKeyhole, LogOut, Mail } from "lucide-react";
import { signOutAction } from "@/app/actions";

export const metadata = {
    title: "Configurações | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Index() {

    return (
        <div className="w-full max-w-2xl mt-20 px-3 mx-auto">
            <div className="flex-1 w-full flex flex-col gap-8">
                <div className="w-full flex flex-col divide-y divide-shark-700">
                    {/* <Link
                        href="/protected/reset-password"
                        className={`
                                    w-full gap-2 flex flex-row p-4 
                                    bg-transparent hover:bg-shark-700 
                                    transition duration-200
                                `}
                    >
                        <LockKeyhole size={18} />
                        <span className="">Redefinir senha</span>
                    </Link> */}

                    <p
                        // href="/update-email"
                        className={`
                                    w-full gap-2 flex flex-row p-4 
                                    bg-transparent hover:bg-shark-700 
                                    transition duration-200 cursor-not-allowed text-shark-400
                                `}
                    >
                        <Mail size={18} />
                        <span className="">Alterar e-mail</span>
                    </p>
                    <p
                        // href="/profile/settings/account"
                        className={`
                                    w-full gap-2 flex flex-row p-4 
                                    bg-transparent hover:bg-shark-700 
                                    transition duration-200 cursor-not-allowed  text-shark-400
                                `}
                    >
                        <Trash size={18} />
                        <span className="">Excluir conta</span>
                    </p>
                    <button
                        className="w-full cursor-pointer gap-2 flex flex-row p-4 text-red-500 bg-transparent hover:bg-shark-700 transition duration-200"
                        onClick={signOutAction}
                    >
                        <LogOut size={18} />

                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
