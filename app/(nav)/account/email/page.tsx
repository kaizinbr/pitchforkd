"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { PinInput } from "@mantine/core";

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

    const [step, setStep] = useState<"email" | "otp" | "success">("email");
    const [otp, setOtp] = useState<string>("");

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");

    async function sendOTP(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            await axios.post("/api/user/email/change", {
                email: formData.get("email"),
            });

            setStep("otp");
            setEmail(formData.get("email") as string);
        } catch (error) {
            setError("An error occurred while sending the confirmation email");
            console.error("Magic link error:", error);
        }
    }

    async function verifyOTP(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("Verifying OTP:", otp, "for email:", email);
        setError(null);

        try {
            const response = await axios.post("/api/user/email/verify", {
                email: email,
                otp: otp,
            });

            if (response.status === 200) {
                setStep("success");
                setMessage("E-mail alterado com sucesso!");
                // Optionally, redirect or perform other actions
            }
        } catch (error: any) {
            setError(error.response?.data?.error || "Erro ao verificar o código OTP");
            console.error("Erro na verificação do OTP:", error);
        }
    }

    return (
        <div className="w-full max-w-2xl md:mt-20 mt-8 px-3 mx-auto">
            <div className="flex-1 w-full flex flex-col gap-4">
                <h3 className="text-gray-300 text-sm ml-2">Alterar e-mail</h3>
                {step === "email" && (
                    <form
                        className="mt-8 gap-4 w-full flex flex-col p-4 bg-shark-900 rounded-2xl overflow-hidden"
                        onSubmit={sendOTP}
                    >
                        <h2 className="font-semibold">
                            Enviaremos uma confirmação para o seu novo e-mail
                        </h2>
                        <div>
                            <label
                                htmlFor="email"
                                className={`
                                            text-sm font-medium text-gray-300 mb-1 block
                                        `}
                            >
                                Novo endereço de e-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="none"
                                className={`
                                                appearance-none relative block 
                                                 placeholder-gray-500 
                                                 focus:ring-main-500 focus:border-main-500 focus:z-10 
                                                transition duration-200  
                                                sm:text-sm

                                                w-full px-3 py-2 bg-shark-800 text-gray-200 rounded-lg focus:outline-none
                                            `}
                                placeholder="laufeylover01@example.com"
                            />
                        </div>

                        {error && (
                            <>
                                <div className="text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            </>
                        )}

                        <div>
                            <Button type="submit">Continuar</Button>
                        </div>
                    </form>
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
                                onSubmit={verifyOTP}
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
                                        onClick={() => {
                                            setStep("email")
                                            setError(null);
                                            setOtp("");
                                        }}
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

                            </form>
                        </div>
                    </>
                )}

                {step === "success" && (
                    <div
                        className={`
                            w-full p-6 bg-green-900 rounded-lg
                            border border-green-700
                        `}
                    >
                        <h2 className="text-green-200 font-semibold text-center">
                            {message}
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}
