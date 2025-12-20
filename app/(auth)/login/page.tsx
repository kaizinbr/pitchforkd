"use client";

import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { PinInput } from "@mantine/core";

export default function LoginPage() {
    // const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    async function sendOTP(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const response = await signIn("resend", {
                ...Object.fromEntries(formData),
                redirect: false,
                // redirectTo: "/",
            });

            if (response?.error) {
                setError("Failed to send magic link");
                return;
            }

            setError("Magic link sent! Check your email.");
            setStep("otp");
            setEmail(formData.get("email") as string);
        } catch (error) {
            setError("An error occurred while sending the magic link");
            console.error("Magic link error:", error);
        }
    }

    async function loginOTP(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const response = await signIn("resend", {
                email,
                token: otp,
                redirect: false,
                redirectTo: "/",
            });

            if (response?.error) {
                setError("Failed to verify OTP");
                return;
            }

            // router.refresh();
        } catch (error) {
            setError("An error occurred while verifying the OTP");
            console.error("OTP verification error:", error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {step === "email" && (
                    <>
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold ">
                                Digite seu e-mail
                            </h2>
                        </div>
                        <form
                            className="mt-8 flex flex-col gap-6"
                            onSubmit={sendOTP}
                        >
                            <div className="rounded-md shadow-sm">
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
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Entrar
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <div className="flex flex-col gap-2 max-w-72">
                            <h2 className="mt-6 text-center text-2xl font-extrabold ">
                                Insira o código de 6 dígitos enviado para seu
                                e-mail
                            </h2>
                            <form
                                className="mt-8 flex flex-col gap-6"
                                onSubmit={loginOTP}
                            >
                                <input
                                    type="hidden"
                                    name="email"
                                    value={email}
                                />
                                <div className="rounded-md shadow-sm">
                                    <div>
                                        <label
                                            htmlFor="otp"
                                            className="sr-only"
                                        >
                                            Código
                                        </label>
                                        <PinInput
                                            value={otp}
                                            onChange={() => {
                                                setOtp(otp);
                                            }}
                                            size="md"
                                            length={6}
                                            type="number"
                                        />
                                    </div>
                                </div>

                                <div className="text-center flex flex-col gap-2">
                                    <button
                                        onClick={() => setStep("email")}
                                        className="text-gray-300 hover:underline"
                                    >
                                        Reenviar código
                                    </button>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Verificar Código
                                    </button>
                                </div>

                                <Link
                                    href="/login/credentials"
                                    className="text-gray-300 text-center hover:underline"
                                >
                                    Prefiro entrar com senha.
                                </Link>
                            </form>
                        </div>
                    </>
                )}
                <div className="text-center flex flex-col gap-2">
                    <Link
                        href="/register"
                        className="text-gray-300 hover:underline"
                    >
                        Não tem uma conta? Registre-se.
                    </Link>
                </div>
            </div>
        </div>
    );
}
