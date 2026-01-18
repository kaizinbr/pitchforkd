"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { PinInput } from "@mantine/core";

import axios from "axios";
import { useSession } from "next-auth/react";
import { TbBrandGoogleFilled } from "react-icons/tb";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<"email" | "otp" | "credentials">("email");
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
            console.log("Verifying OTP:", otp, "for email:", email);

            const response = await signIn("credentials-otp", {
                email,
                otp: otp,
                redirect: false,
            });

            if (response?.error) {
                setError("Código inválido ou expirado.");
                return;
            }

            console.log(response);
            // Successful login
            router.push("/home");
            // router.refresh();
            // router.push("/");
        } catch (error) {
            setError("An error occurred while verifying the OTP");
            console.error("OTP verification error:", error);
        }
    }

    async function credentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const checkRes = await axios.post("/api/auth/check-login-method", {
                email: formData.get("email"),
            });

            const checkData = checkRes.data;
            console.log("Check login method response:", checkData);

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
        <div className="min-h-screen flex items-center justify-center p-4 sm:px-6 lg:px-8 max-w-md w-full mx-auto">
            <div className="max-w-md w-full space-y-8">
                {step === "email" && (
                    <>
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold ">
                                Entre ou cadastre-se
                            </h2>
                        </div>
                        <form
                            className="mt-8 flex flex-col gap-4"
                            onSubmit={sendOTP}
                        >
                            <div className="rounded-lg shadow-sm">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className={`
                                            test-sm font-medium text-gray-300 mb-1 block
                                        `}
                                    >
                                        Endereço de e-mail
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className={`
                                                appearance-none relative block w-full px-3 py-2 
                                                border border-gray-500 placeholder-gray-500 
                                                rounded-lg focus:outline-none focus:ring-main-500 focus:border-main-500 focus:z-10 
                                                transition duration-200  text-white
                                                sm:text-sm
                                            `}
                                        placeholder="laufeylover01@example.com"
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
                                <Button type="submit">
                                    Continuar
                                </Button>
                            </div>
                        </form>
                    </>
                )}
                {step === "otp" && (
                    <>
                        <div className="flex flex-col gap-2 ">
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
                                <div className="rounded-lg shadow-sm">
                                    <div className="mx-auto flex items-center justify-center">
                                        <label
                                            htmlFor="otp"
                                            className="sr-only"
                                        >
                                            Código
                                        </label>
                                        <PinInput
                                            value={otp}
                                            onChange={(value) => {
                                                setOtp(value);
                                            }}
                                            size="md"
                                            length={6}
                                            type="number"
                                            classNames={{
                                                input: `
                                                    mx-1 text-center 
                                                    border border-gray-500 
                                                    rounded-lg! 
                                                    focus:outline-none! focus:ring-main-500! focus:border-main-500! 
                                                    bg-shark-900! text-white! text-lg! font-semibold!
                                                `,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="text-center flex flex-col gap-2">
                                    <button
                                        onClick={() => setStep("email")}
                                        className={`
                                                text-gray-300 text-sm! hover:underline
                                                cursor-pointer
                                                py-1 px-3 rounded-full border border-gray-600
                                                w-fit mx-auto
                                            `}
                                    >
                                        Reenviar código
                                    </button>
                                </div>
                                <div>
                                    <Button
                                        type="submit"
                                        disabled={otp.length < 6}
                                        className={`
                                                ${otp.length < 6 ? "opacity-50 cursor-not-allowed" : ""}
                                            `}
                                    >
                                        Verificar Código
                                    </Button>
                                </div>

                                {error && (
                                    <>
                                        <div className="text-red-400 text-sm text-center">
                                            {error}
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={() => setStep("credentials")}
                                    className="text-gray-300 text-center hover:underline"
                                >
                                    Prefiro entrar com senha.
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {step === "credentials" && (
                    <div className="max-w-md w-full space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold ">
                                Entre com e-mail e senha
                            </h2>
                        </div>
                        <form
                            className="mt-8 space-y-6"
                            onSubmit={credentialsSubmit}
                        >
                            <div className="rounded-lg shadow-sm -space-y-px">
                                <div className="rounded-lg shadow-sm">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className={`
                                            test-sm font-medium text-gray-300 mb-1 block
                                        `}
                                        >
                                            Endereço de e-mail
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
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

                                <div className="rounded-lg shadow-sm mt-3">
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className={`
                                                test-sm font-medium text-gray-300 mb-1 block
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
                                                rounded-lg focus:outline-none focus:ring-main-500 focus:border-main-500 focus:z-10 
                                                transition duration-200  text-white
                                                sm:text-sm
                                            `}
                                            placeholder="********"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div>
                                <Button
                                    type="submit"
                                >
                                    Entrar
                                </Button>
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
                                Não possui uma conta? Cadastre-se aqui.
                            </Link>
                        </div>
                    </div>
                )}

                {step !== "otp" && step !== "credentials" && (
                    <>
                        <div className="mt-6 text-center">Ou entre com</div>
                        <div className="mt-2 flex justify-center gap-4">
                            <Button
                                onClick={() =>
                                    signIn("google", { redirectTo: "/home" })
                                }
                                variant="outline"
                            >
                                <TbBrandGoogleFilled className="size-5 mr-2" />
                                Google
                            </Button>
                        </div>
                    </>
                )}

                {error === "OAuthAccountNotLinked" && (
                    <div className="text-red-400 text-sm text-center">
                        Conta do Google não vinculada. Por favor, entre com
                        outro método.
                    </div>
                )}
            </div>
        </div>
    );
}
