"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AccountPage() {
    // const { data: session } = useSession();

    // if (!session) {
    //     return (
    //         <div className="w-full max-w-2xl md:mt-20 mt-8 px-3 mx-auto">
    //             <p className="text-gray-400 text-center">
    //                 Você precisa estar logado para acessar esta página.
    //             </p>
    //         </div>
    //     );
    // }

    const [message, setMessage] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [charcount, setCharcount] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);

    useEffect(() => {
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                setMessage("As senhas não coincidem.");
            } else {
                setMessage(null);
            }
        }

        if (password.length > 8 && password.length < 32) {
            setCharcount(true);
        } else {
            setCharcount(false);
        }

        if (/[A-Z]/.test(password)) {
            setHasUppercase(true);
        } else {
            setHasUppercase(false);
        }

        if (/[a-z]/.test(password)) {
            setHasLowercase(true);
        } else {
            setHasLowercase(false);
        }

        if (/[0-9]/.test(password)) {
            setHasNumber(true);
        } else {
            setHasNumber(false);
        }

        if (/[!@#$%^&*.]/.test(password)) {
            setHasSpecialChar(true);
        } else {
            setHasSpecialChar(false);
        }
    }, [password, confirmPassword]);

    const changePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const responde = await axios
            .post("/api/user/password", { password: password })
            .then((res) => {
                setMessage("");
                alert("Senha alterada com sucesso!");
                redirect("/account");
                
            })
            .catch((err) => {
                if (err.response) {
                    setMessage(err.response.data.error);
                }
            });
    };

    return (
        <div className="w-full max-w-2xl md:mt-20 mt-8 px-3 mx-auto">
            <div className="flex-1 w-full flex flex-col gap-4">
                <h3 className="text-gray-300 text-sm ml-2 mb-2">
                    Definir nova senha
                </h3>
                <div className="w-full flex flex-col bg-shark-900 rounded-xl overflow-hidden p-4">
                    <h2 className="">Sua nova senha deve:</h2>
                    <ul className="px-4 py-2 flex flex-col gap-1">
                        <li
                            className={` text-sm list-disc ${charcount ? "text-green-400" : "text-gray-400"}`}
                        >
                            Conter entre 8 e 32 caracteres
                        </li>
                        <li
                            className={` text-sm list-disc ${hasUppercase && hasLowercase ? "text-green-400" : "text-gray-400"}`}
                        >
                            Incluir letras maiúsculas e minúsculas
                        </li>
                        <li
                            className={` text-sm list-disc ${hasNumber ? "text-green-400" : "text-gray-400"}`}
                        >
                            Incluir ao menos um número
                        </li>
                        <li
                            className={` text-sm list-disc ${hasSpecialChar ? "text-green-400" : "text-gray-400"}`}
                        >
                            Incluir ao menos um caractere especial (!@#$%^&*.)
                        </li>
                    </ul>
                </div>
                <form
                    onSubmit={changePassword}
                    className="w-full flex flex-col bg-shark-900 rounded-xl overflow-hidden"
                >
                    <div
                        className={`
                                    w-full flex flex-col px-4
                                    py-4 border-b border-shark-800
                                    gap-4
                                `}
                    >
                        <div
                            className={`
                                    w-full gap-2 flex flex-col
                                `}
                        >
                            <label
                                className="text-gray-400 text-sm mb-1"
                                htmlFor="new-password"
                            >
                                Nova senha:
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                className="w-full px-3 py-2 bg-shark-800 text-gray-200 rounded-lg focus:outline-none"
                                autoComplete="new-password"
                                placeholder="Digite sua nova senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div
                            className={`
                                    w-full gap-2 flex flex-col
                                `}
                        >
                            <label
                                className="text-gray-400 text-sm mb-1"
                                htmlFor="confirm-new-password"
                            >
                                Confirmar nova senha:
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                className="w-full px-3 py-2 bg-shark-800 text-gray-200 rounded-lg focus:outline-none"
                                autoComplete="new-password"
                                placeholder="Digite sua nova senha"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        {message && (
                            <p className="text-red-300 text-sm">{message}</p>
                        )}

                        <Button
                            type="submit"
                            className=""
                            disabled={
                                !!message ||
                                !password ||
                                !confirmPassword ||
                                !charcount ||
                                !hasUppercase ||
                                !hasLowercase ||
                                !hasNumber ||
                                !hasSpecialChar
                            }
                        >
                            Definir senha
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
