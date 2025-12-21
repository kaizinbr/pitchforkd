"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const checkRes = await axios.post("/api/auth/check-login-method", {
                email: formData.get("email"),
            });

            const checkData = checkRes.data;
            console.log("Check login method response:", checkData);

            // if (!checkData.exists) {
            //     // Email não cadastrado, prossegue com registro
            //     const result = await signIn("credentials", {
            //         email,
            //         password,
            //         redirect: false,
            //     });
            //     // ...
            //     return;
            // }

            if (!checkData.hasPassword) {
                // Mostra mensagem informando o método correto
                setError(checkData.message);
                // setShowOAuthButtons(true); // Destaca os botões OAuth
                return;
            }

            const response = await signIn("credentials", {
                ...Object.fromEntries(formData),
                redirect: false,
            });

            if (response?.error) {
                if (response.error === "NO_PASSWORD_SET") {
                    setError(
                        'Esta conta foi criada com Google. Use o botão "Entrar com Google" ou cadastre uma senha.'
                    );
                    // setShowPasswordReset(true); // Opcional: mostrar opção de criar senha
                } else if (response.error === "INVALID_CREDENTIALS") {
                    setError("Email ou senha incorretos.");
                }
                return;
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            setError("An error occurred during login");
            console.error("Login error:", error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold ">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center flex flex-col gap-2">
                    <Link
                        href="/password-reset"
                        className="text-blue-600 hover:underline"
                    >
                        Esqueci minha senha.
                    </Link>
                    <Link
                        href="/register"
                        className="text-blue-600 hover:underline"
                    >
                        No account? Register.
                    </Link>
                </div>
            </div>
        </div>
    );
}
