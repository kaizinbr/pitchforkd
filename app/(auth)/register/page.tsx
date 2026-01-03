"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const signInResult = await signIn("credentials", {
                ...Object.fromEntries(formData),
                redirect: false,
            });

            if (signInResult?.error) {
                setError("Failed to sign in after registration");
                return;
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Registration failed"
            );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:px-6 lg:px-8 max-w-md w-full mx-auto">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold ">
                        Crie sua conta
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label
                                htmlFor="name"
                                className={`
                                                test-sm font-medium text-gray-300 mb-1 block
                                            `}
                            >
                                Nome
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className={`
                                                appearance-none relative block w-full px-3 py-2 
                                                border border-gray-500 placeholder-gray-500 
                                                rounded-md focus:outline-none focus:ring-main-500 focus:border-main-500 focus:z-10 
                                                transition duration-200  text-white
                                                sm:text-sm
                                            `}
                                placeholder="Nome completo"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className={`
                                                test-sm mt-3 font-medium text-gray-300 mb-1 block
                                            `}
                            >
                                E-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={`
                                                appearance-none relative block w-full px-3 py-2 
                                                border border-gray-500 placeholder-gray-500 
                                                rounded-md focus:outline-none focus:ring-main-500 focus:border-main-500 focus:z-10 
                                                transition duration-200  text-white
                                                sm:text-sm
                                            `}
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className={`
                                            test-sm mt-3 font-medium text-gray-300 mb-1 block
                                        `}
                            >
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`
                                                appearance-none relative block w-full px-3 py-2 
                                                border border-gray-500 placeholder-gray-500 
                                                rounded-md focus:outline-none focus:ring-main-500 focus:border-main-500 focus:z-10 
                                                transition duration-200  text-white
                                                sm:text-sm
                                            `}
                                placeholder="laufeylover01@example.com"
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
                            className={`
                                        group relative w-full flex justify-center border 
                                        border-transparent 
                                        text-white bg-main-500 hover:bg-main-600 
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-500 
                                        
                                        px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200
                                        cursor-pointer
                                    `}
                        >
                            Continuar
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Já possui uma conta? Entre aqui.
                    </Link>
                </div>
            </div>
        </div>
    );
}
