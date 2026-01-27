"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { PinInput } from "@mantine/core";
import { signOut } from "next-auth/react";

export default function AccountPage() {
    const [step, setStep] = useState<"email" | "otp" | "confirm" | "success">(
        "email",
    );
    const [otp, setOtp] = useState<string>("");

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    const [deleteToken, setDeleteToken] = useState<string>("");

    async function sendOTP(event: React.MouseEvent<HTMLButtonElement>) {
        try {
            event.preventDefault();

            await axios.post("/api/user/delete/otp");

            setStep("otp");
        } catch (error) {
            setError("An error occurred while sending the confirmation email");
            console.error("Magic link error:", error);
        }
    }

    async function verifyOTP(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("Verifying OTP:", otp);
        setError(null);

        try {
            const response = await axios.post("/api/user/delete/verify", {
                otp: otp,
            });

            if (response.status === 200) {
                setStep("confirm");
                setDeleteToken(response.data.token);
                // setMessage("E-mail alterado com sucesso!");
                // Optionally, redirect or perform other actions
            }
        } catch (error: any) {
            setError(
                error.response?.data?.error || "Erro ao verificar o código OTP",
            );
            console.error("Erro na verificação do OTP:", error);
        }
    }

    async function deleteAccount() {
        try {
            const response = await axios.post("/api/user/delete/confirm", {
                token: deleteToken,
            });
            if (response.status === 200) {
                setMessage("Conta excluída com sucesso.");
                setStep("success");

                signOut({ redirectTo: "/" })
                // Optionally, redirect or perform other actions
            }
        } catch (error: any) {
            setError(error.response?.data?.error || "Erro ao excluir a conta");
            console.error("Erro na exclusão da conta:", error);
        }
    }

    return (
        <div className="w-full max-w-2xl md:mt-20 mt-8 px-3 mx-auto">
            <div className="flex-1 w-full flex flex-col gap-4">
                <h3 className="text-gray-300 text-sm ml-2">Excluir conta</h3>
                {step === "email" && (
                    <div className="mt-8 gap-4 w-full flex flex-col p-4 bg-shark-900 rounded-2xl overflow-hidden">
                        <h2 className="font-semibold">
                            Enviaremos uma confirmação para o seu novo e-mail
                        </h2>
                        <p className="text-sm">
                            Ao prosseguir, você confirma a exclusão da sua conta
                            e a ciência de que esta ação é irreversível.
                        </p>

                        {error && (
                            <>
                                <div className="text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            </>
                        )}

                        <div>
                            <Button onClick={sendOTP}>Continuar</Button>
                        </div>
                    </div>
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
                                            setStep("email");
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

                {step === "confirm" && (
                    <>
                        <div className="flex flex-col gap-2 mt-8 w-full flex flex-col p-4 bg-shark-900 rounded-2xl overflow-hidden">
                            <h2 className="mt-6 text-center text-2xl font-extrabold ">
                                Tem certeza que deseja excluir sua conta?
                            </h2>
                            <p className="text-sm text-center">
                                Esta ação é irreversível. Todos os seus dados
                                serão permanentemente excluídos imediatamente e
                                não poderão ser recuperados. <br />
                                <br /> Você ainda poderá se inscrever novamente
                                no futuro.
                            </p>
                            
                        {error && (
                            <>
                                <div className="text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            </>
                        )}
                            <div className="mt-4 flex gap-4 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setStep("email");
                                        setError(null);
                                        setOtp("");
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button variant="destructive" onClick={deleteAccount}>
                                    Excluir Conta
                                </Button>
                            </div>
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
