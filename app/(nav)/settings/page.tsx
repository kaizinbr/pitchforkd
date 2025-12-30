import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Trash, LockKeyhole, LogOut, Mail } from "lucide-react";
import { signOutAction } from "@/app/actions";

export const metadata = {
    title: "Configurações | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Index() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
        .from("profiles")
        .select()
        .eq("id", user?.id)
        .single();

    // console.log(data);

    return (
        <div className="w-full max-w-2xl mt-20 px-3 mx-auto">
            <div className="flex-1 w-full flex flex-col gap-8">
                <h1 className="text-xl font-bold">Suas configurações</h1>
                <div className="flex flex-col gap-4 bg-shark-700 rounded-3xl px-6 py-4">
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-2">
                            <span className="text-base">
                                Nome: {data?.name}
                            </span>
                            <span className="text-base">
                                Email: {user?.email}
                            </span>

                            <span className="text-base">
                                {user?.identities! && (
                                    <>
                                        Criado em:{" "}
                                        {new Date(
                                            user?.created_at ?? ""
                                        ).toLocaleDateString("pt-BR")}
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
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
