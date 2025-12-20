"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleMagicLinkSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const response = await signIn("resend", {
                ...Object.fromEntries(formData),
                redirect: false,
                redirectTo: "/account/password/reset",
            });

            if (response?.error) {
                setError("Ocorreu um erro, tente novamente.");
                return;
            }

            setError("Enviamos instruções para redefinir sua senha. Verifique seu e-mail.");
        } catch (error) {
            setError("Ocorreu um erro, tente novamente.");
            console.error("Magic link error:", error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold ">
                        Digite seu e-mail para redefinir sua senha
                    </h2>
                </div>
                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleMagicLinkSubmit}
                >
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
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    {error && (
                        <>
                            <div className="text-red-400 text-sm text-center">
                                {error}
                            </div>
                        </>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Redefinir senha
                        </button>
                    </div>
                </form>
                <div className="text-center flex flex-col gap-2">
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
